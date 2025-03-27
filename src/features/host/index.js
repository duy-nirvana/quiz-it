import { bigSmile } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import {
    ActionIcon,
    Button,
    Divider,
    Loader,
    Modal,
    Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconArrowsMaximize,
    IconRelationOneToMany,
    IconUserFilled,
} from '@tabler/icons-react';
import { sessionApi } from 'api';
import QuizPreview from 'components/QuizPreview';
import { showToast } from 'helpers';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { socket } from 'socket';
import { fetchPersonal } from 'store/personal/personalThunk';
import { twMerge } from 'tailwind-merge';
import { getParticipantAvatar } from 'utils/avatar';

function HostInfo({ direction = 'row', sessionInfo, opened }) {
    return (
        <div
            className={twMerge(
                `flex flex-${direction} justify-center`,
                direction === 'row' && 'items-center'
            )}
        >
            <div className="border-slate-200 px-5 py-4 text-center">
                <p className="text-2xl">
                    Join at{' '}
                    <span className="font-semibold">
                        {window.location.hostname}
                    </span>{' '}
                </p>
                <p className="inline text-xl">or</p>
                <p className="text-2xl">
                    Scan a <span className="font-semibold">QR code</span>
                </p>
            </div>
            <Divider
                orientation={direction === 'row' ? 'vertical' : 'horizontal'}
                color="grey"
                size="sm"
                className="opacity-10"
            />
            <div className="px-5 py-4 text-center">
                <p className="text-2xl">GAME PIN:</p>
                <p className="text-7xl font-black">{sessionInfo?.host_id}</p>
            </div>
            <Divider
                orientation={'vertical'}
                color="grey"
                size="sm"
                className="opacity-10"
            />
            <div
                className={twMerge(
                    'flex justify-center px-5 py-4',
                    opened && direction === 'row' && 'blur'
                )}
            >
                <QRCode
                    // value={`${window.location.hostname}:3000/host/${sessionInfo?.host_id}`}
                    value={`https://www.facebook.com/`}
                    size={direction === 'row' ? 150 : 250}
                />
            </div>
        </div>
    );
}

function HostLiveFeature(props) {
    let { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { profile } = useSelector((state) => state.personal);
    const { access_token } = useSelector((state) => state.auth);

    const [opened, { open, close }] = useDisclosure(false);
    const [sessionInfo, setSessionInfo] = useState();
    const [countdownToStart, setCountdownToStart] = useState(5);
    const [isStarted, setIsStarted] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [submittedTotal, setSubmittedTotal] = useState(0);

    const [participantsWithScore, setParticipantsWithScore] = useState([]);
    let { current: participantsWithScoreRef } = useRef([]);

    const participantsMapping = useMemo(() => {
        return participants.reduce((acc, cur) => {
            acc[cur.socket_id] = {
                ...cur,
            };

            return acc;
        }, []);
    }, [participants.length]);

    const form = useForm();

    useEffect(() => {
        // When a host page loads, listen for new participants joining
        socket.emit('host_join', id);

        // Listen for new participants joining
        socket.on('new_participant', (participant) => {
            console.log({ participant });

            setParticipants((prevParticipants) => [
                ...prevParticipants,
                participant,
            ]);
        });

        // socket.on('session_info', (res) => {
        //     setSessionInfo(res);
        // });

        socket.on('session_active', (status) => {
            setSessionInfo((prev) => ({
                ...prev,
                is_active: status,
            }));
        });

        // Clean up the socket connection when the component unmounts

        socket.on('participant_left', (data) => {
            console.log('participant off', data);
            setParticipants((prevParticipants) =>
                prevParticipants.filter(
                    (participant) => participant.socket_id !== data.socket_id
                )
            );
        });

        socket.on('countdown_started', () => {
            setCountdownToStart(5);
            setIsStarted(true);
        });

        // socket.on('game_started', () => {
        //     setSessionInfo((prev) => ({
        //         ...prev,
        //         is_active: true,
        //     }));
        // });

        // write logic player selected here
        socket.on('participant_selected', (data) => {
            updateScore(data);
            // const { participantSocketId, answerIndex } = data;

            // console.log('current values: ', form.getValues());
            // console.log('AAAAAAAAAAAAA DATA', data);
        });

        return () => {
            socket.off('new_participant');
            socket.off('session_info');
            socket.off('participant_left');
            socket.off('session_active');
            socket.disconnect();
        };
    }, [id]);

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
        if (location.state) {
            setSessionInfo(location.state);
        } else {
            getSession(id).then((data) => setSessionInfo(data));
        }
    }, [location]);

    useEffect(() => {
        if (isStarted) {
            let timerId = null;

            if (countdownToStart) {
                timerId = setInterval(() => {
                    setCountdownToStart(countdownToStart - 1);
                }, 1000);
            }

            if (countdownToStart === 0) {
                socket.emit('start_game', id);
            }

            return () => {
                clearInterval(timerId);
            };
        }
    }, [countdownToStart, isStarted]);

    useEffect(() => {
        socket.emit('count_submit', { hostId: id, submittedTotal });
    }, [submittedTotal]);

    useEffect(() => {
        if (sessionInfo?.quiz) {
            form.reset(sessionInfo.quiz);
        }
    }, [sessionInfo]);

    const getSession = async (id) => {
        try {
            const { data } = await sessionApi.getDetail(id);
            setParticipants(data?.participants);
            return data;
        } catch (error) {
            console.error(error);
            showToast({ type: 'error', message: 'Fail to fetch session!' });
        }
    };

    const updateScore = (data) => {
        const participant = { ...data };
        const {
            participantSocketId: socket_id,
            score,
            questionIndex,
            answerIndex,
            name,
            user,
        } = participant;

        console.log('----- USER SELECTED: ', data);

        setSubmittedTotal((prev) => prev + 1);

        setParticipantsWithScore((prev) => [
            ...prev,
            {
                socket_id,
                score,
                name,
                user,
                questionIndex,
                answerIndex,
            },
        ]);
    };

    const handleStart = () => {
        socket.emit('start_countdown', id);
    };

    console.log({ sessionInfo });

    if (!sessionInfo) {
        return (
            <div className="relative h-screen min-h-0 overflow-hidden bg-indigo-950 p-4">
                <div className="relative flex h-full flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-4 rounded-md bg-slate-600/50 px-4 py-3">
                        <p className="text-xl font-bold text-white">Loading</p>
                        <Loader color="white" />
                    </div>
                </div>
            </div>
        );
    }

    if (sessionInfo?.is_finished) {
        navigate(`/result/${id}`);
    }

    if (isStarted) {
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
                <QuizPreview
                    form={form}
                    quizList={sessionInfo?.quiz?.questions}
                    submittedTotal={submittedTotal}
                    setSubmittedTotal={setSubmittedTotal}
                    open={true}
                    isPlaying
                    isHost
                    participants={participants}
                    participantsWithScore={participantsWithScore}
                    sessionInfo={sessionInfo}
                    participantsMapping={participantsMapping}
                />
            </div>
        );
    }

    return (
        <div className="relative h-screen min-h-0 overflow-hidden bg-indigo-950 p-4">
            <div className="relative flex h-full flex-col items-center justify-center gap-3">
                <div
                    className="absolute top-0 flex cursor-pointer items-center rounded-md bg-white text-center"
                    onClick={open}
                >
                    <HostInfo sessionInfo={sessionInfo} opened={opened} />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {!participants.length ? (
                        <div className="animate-[pulse_1.2s_ease-in-out_infinite] rounded-md bg-slate-600/50 px-4 py-3">
                            <p className="text-3xl font-bold text-white">
                                Waiting for players...
                            </p>
                        </div>
                    ) : (
                        <>
                            {participants.map((participant) => (
                                <div className="relative flex cursor-pointer items-center gap-2 rounded-md bg-white p-1.5 after:absolute after:w-0 after:transition-all after:duration-500 after:ease-out hover:bg-gray-200 hover:after:left-0 hover:after:h-1 hover:after:w-full hover:after:bg-gray-900 hover:cursor-remove">
                                    <img
                                        src={getParticipantAvatar({
                                            size: 70,
                                            ...participant.avatar,
                                        })}
                                    />
                                    <p className="text-xl font-bold">
                                        {participant?.name}
                                    </p>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 flex items-center gap-3">
                    <Button
                        size="lg"
                        color="orange"
                        onClick={handleStart}
                        disabled={!participants.length}
                    >
                        Start
                    </Button>
                    <div className="flex rounded-md bg-slate-600/50 px-4 py-2.5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-0.5">
                                <IconUserFilled color="white" />
                                <p className="text-2xl font-bold text-white">
                                    {participants.length}
                                </p>
                            </div>
                            <Tooltip
                                label="Full screen"
                                withArrow
                                position="top"
                            >
                                <ActionIcon variant="subtle" color="white">
                                    <IconArrowsMaximize />
                                </ActionIcon>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                opened={opened}
                onClose={close}
                centered
                withCloseButton={false}
                classNames={{
                    body: 'p-0',
                }}
            >
                <HostInfo
                    opened={opened}
                    sessionInfo={sessionInfo}
                    direction="col"
                />
            </Modal>
        </div>
    );
}

export default HostLiveFeature;
