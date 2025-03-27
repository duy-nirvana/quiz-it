import { bigSmile } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconDice6Filled, IconMoodHappyFilled } from '@tabler/icons-react';
import InputField from 'components/form-controls/InputField';
import { showToast } from 'helpers';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { socket } from 'socket';
import { fetchPersonal } from 'store/personal/personalThunk';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';
import CustomAvatarModal from './components/CustomAvatarModal';
import { getParticipantAvatar } from 'utils/avatar';
import QuizPreview from 'components/QuizPreview';

function ParticipantPlaying(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: hostId } = useParams();
    const form = useForm({
        defaultValues: {
            avatar: {
                skinColor: ['ffe4c0'],
                hair: ['shortHair'],
                hairColor: ['3a1a00'],
                eyes: ['normal'],
                mouth: ['openedSmile'],
                accessories: [],
            },
        },
        resolver: yupResolver(
            yup.object({
                name: yup.string().required(),
            })
        ),
    });
    const [sessionInfo, setSessionInfo] = useState();
    const [loading, setLoading] = useState(false);
    const { profile } = useSelector((state) => state.personal);
    const { access_token } = useSelector((state) => state.auth);
    const [countdownToStart, setCountdownToStart] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    // const isStarted = useRef();
    const startDatetime = useRef();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [participantInfo, setParticipantInfo] = useState(null);

    const [playerCurrentQuizIndex, setPlayerCurrentQuizIndex] = useState(0);
    const timeLimit = Number(
        form.getValues(`questions.${playerCurrentQuizIndex}.time_limit`)
    );
    const [playerCountdownTimeLimit, setPlayerCountdownTimeLimit] =
        useState(timeLimit);

    const [submittedTotal, setSubbmitedTotal] = useState(0);

    useLayoutEffect(() => {
        getRandomAvatar();
    }, []);

    useEffect(() => {
        if (!profile) {
            if (access_token) {
                dispatch(fetchPersonal());
            } else {
                dispatch(fetchPersonal({ is_temp: true }));
            }
        }
    }, []);

    useEffect(() => {
        // Emit the join session event when participant arrives
        // socket.emit('join_session', hostId, 'Duy Tran 123');
        socket.connect();

        // Listen for session information (like game start)
        // socket.on('session_info', (session) => {
        //     console.log({ session });
        //     setSessionInfo(session);
        // });

        socket.on('new_participant', (participant) => {
            if (participantInfo) return;

            if (participant.socket_id === socket.id) {
                setParticipantInfo(participant);
            }
        });

        socket.on('session_error', (msg) => {
            showToast({ type: 'error', message: msg });
        });

        socket.on('countdown_started', () => {
            setCountdownToStart(5);
        });

        socket.on('quiz_info', (res) => {
            setSessionInfo(res);
            // form.setValue('quiz', res?.quiz);
            form.reset({ ...form.getValues(), ...res?.quiz });
        });

        socket.on('session_active', (status) => {
            console.log('game start:!!');
            setIsStarted(status);
            // isStarted.current = status;
            setCountdownToStart(0);
        });

        socket.on('question_changed_index', (data) => {
            const { dateTime, questionIndex } = data;

            startDatetime.current = dateTime;

            setSelectedIndex(null);
            setPlayerCurrentQuizIndex(questionIndex);
            setPlayerCountdownTimeLimit(
                Number(form.getValues(`questions.${questionIndex}.time_limit`))
            );
        });

        socket.on('total_submitted', (total) => {
            setSubbmitedTotal(total);
        });

        socket.on('question_countdown', (time) => {
            setPlayerCountdownTimeLimit(time);
        });

        socket.on('game_ended', () => {
            navigate(`/result/${hostId}`);
        });

        // Clean up socket connections
        return () => {
            socket.off('session_info');
            socket.off('session_active');
            socket.off('countdown_started');
            socket.off('quiz_info');
            socket.off('question_changed_index');
            socket.off('question_countdown');
            socket.off('total_submitted');
            socket.off('game_ended');
            socket.disconnect();
        };
    }, [hostId]);

    useEffect(() => {
        if (countdownToStart) {
            let timerId = null;

            timerId = setInterval(() => {
                setCountdownToStart(countdownToStart - 1);
            }, 1000);

            return () => {
                clearInterval(timerId);
            };
        }
    }, [countdownToStart]);

    const getRandomAvatar = () => {
        const { skinColor, hair, hairColor, eyes, mouth, accessories } =
            bigSmile.schema.properties;

        const getRandomProperty = (property) => {
            return [
                property.default[
                    Math.floor(Math.random() * property.default.length)
                ],
            ];
        };

        const randomAvatar = {
            ...form.getValues('avatar'),
            skinColor: getRandomProperty(skinColor),
            hair: getRandomProperty(hair),
            hairColor: getRandomProperty(hairColor),
            eyes: getRandomProperty(eyes),
            mouth: getRandomProperty(mouth),
            accessories: getRandomProperty(accessories),
        };

        form.setValue('avatar', randomAvatar);
    };

    const handleSelect = (index) => {
        const dateSelected = new Date().getTime();
        let score = 0;

        setSelectedIndex(index);

        if (dateSelected > startDatetime.current) {
            score = timeLimit - (dateSelected - startDatetime.current) / 1000;
        } else {
            score = timeLimit;
        }

        console.log({ participantInfo });
        socket.emit('select_answer', {
            hostId,
            participantSocketId: participantInfo.socket_id,
            name: participantInfo?.name,
            user: participantInfo?.user || null,
            avatar: participantInfo?.avatar,
            score,
            questionIndex: playerCurrentQuizIndex,
            answerIndex: index,
        });
    };

    const handleSubmit = async (values) => {
        const participant = {
            // ...values,
            hostId,
            name: values.name,
            avatar: values.avatar,
        };

        if (profile) {
            participant.user = profile._id;
        }

        socket.emit('join_session', participant);
    };

    if (sessionInfo?.is_finished) {
        navigate(`/result/${hostId}`);
    }

    if (sessionInfo) {
        if (sessionInfo?.is_active || isStarted) {
            return (
                <div className="relative z-50 h-screen min-h-0 overflow-hidden bg-indigo-950 p-4">
                    <QuizPreview
                        form={form}
                        quizList={sessionInfo?.quiz?.questions}
                        open
                        isPlaying
                        isPlayer
                        selectedIndex={selectedIndex}
                        onSelect={handleSelect}
                        playerCurrentQuizIndex={playerCurrentQuizIndex}
                        playerCountdownTimeLimit={playerCountdownTimeLimit}
                        submittedTotal={submittedTotal}
                    />
                </div>
            );
        }

        if (countdownToStart) {
            return (
                <div className="relative h-screen min-h-0 overflow-hidden bg-indigo-950 p-4">
                    <div className="relative flex h-full flex-col items-center justify-center gap-3">
                        <div
                            className={twMerge(
                                'rounded-md bg-slate-600/50 px-4 py-3',
                                countdownToStart === 1 &&
                                    'animate-[ping_1s_ease-in-out]'
                            )}
                        >
                            <p className="text-5xl font-bold text-white">
                                Ready in {countdownToStart}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="relative h-screen min-h-0 overflow-hidden bg-indigo-950 p-4">
                <div className="relative flex h-full flex-col items-center justify-center gap-3">
                    <div className="rounded-md bg-slate-600/50 px-4 py-3">
                        <p className="text-3xl font-bold text-white">
                            {form.getValues('name')}
                        </p>
                    </div>
                    <div className="animate-[pulse_1.2s_ease-in-out_infinite] rounded-md bg-slate-600/50 px-4 py-3">
                        <p className="text-3xl font-bold text-white">
                            Waiting other players...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-screen flex-1 flex-grow flex-col items-center justify-center bg-indigo-950">
            <div className="flex w-96 min-w-fit flex-col gap-3 rounded-xl bg-indigo-800 p-6 text-center">
                <p className="mb-2 text-2xl font-bold text-white">
                    Join the game
                </p>
                <div className="rounded-md bg-white px-4 py-2 text-center">
                    <p className="text-xl">GAME PIN:</p>
                    <p className="text-4xl font-black">{hostId}</p>
                </div>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-3"
                >
                    <div className="flex w-fit items-end gap-2 self-center">
                        <img
                            src={getParticipantAvatar({
                                ...form.watch('avatar'),
                            })}
                        />
                        <div className="flex flex-col">
                            <Tooltip label="Random avatar" position="right">
                                <ActionIcon
                                    variant="subtle"
                                    color="white"
                                    onClick={getRandomAvatar}
                                >
                                    <IconDice6Filled />
                                </ActionIcon>
                            </Tooltip>
                            <CustomAvatarModal
                                form={form}
                                getRandomAvatar={getRandomAvatar}
                            >
                                <Tooltip label="Custom avatar" position="right">
                                    <ActionIcon variant="subtle" color="white">
                                        <IconMoodHappyFilled />
                                    </ActionIcon>
                                </Tooltip>
                            </CustomAvatarModal>
                        </div>
                    </div>
                    <InputField
                        form={form}
                        name="name"
                        placeholder="Enter nickname"
                        size="lg"
                        classNames={{
                            input: '!text-center font-bold',
                        }}
                        showErrorText={false}
                        maxLength={20}
                    />
                    <Button
                        variant="filled"
                        size="lg"
                        color="orange"
                        className="min-w-full"
                        type="submit"
                        loading={loading}
                    >
                        Start
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default ParticipantPlaying;
