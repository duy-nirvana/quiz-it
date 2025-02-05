import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mantine/core';
import InputField from 'components/form-controls/InputField';
import { showToast } from 'helpers';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { socket } from 'socket';
import { fetchPersonal } from 'store/personal/personalThunk';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

function ParticipantPlaying(props) {
    const dispatch = useDispatch();
    const location = useLocation();
    const { id: host_id } = useParams();
    const form = useForm({
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

    useEffect(() => {
        if (!profile) {
            if (access_token) {
                dispatch(fetchPersonal());
            } else {
                dispatch(fetchPersonal({ is_temp: true }));
            }
        }
    }, []);

    console.log({ profile });

    useEffect(() => {
        // Emit the join session event when participant arrives
        // socket.emit('join_session', host_id, 'Duy Tran 123');
        socket.connect();

        // Listen for session information (like game start)
        // socket.on('session_info', (session) => {
        //     console.log({ session });
        //     setSessionInfo(session);
        // });

        socket.on('session_error', (msg) => {
            console.log('session error!!!!!!!');
            showToast({ type: 'error', message: msg });
        });

        socket.on('countdown_started', () => {
            setCountdownToStart(10);
        });

        socket.on('quiz_info', (res) => {
            console.log({res})
            setSessionInfo(res);
        });

        socket.on('session_active', (status) => {
            console.log('game start:!!');
            setIsStarted(status);
            setCountdownToStart(0);
        });

        // Clean up socket connections
        return () => {
            socket.off('session_info');
            socket.off('session_active');
            socket.off('countdown_started');
            socket.off('quiz_info');
            socket.disconnect();
        };
    }, [host_id]);

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

    const handleSubmit = async (values) => {
        const participant = {
            hostId: host_id,
            name: values.name,
        };

        if (profile) {
            participant.user = profile._id;
        }

        socket.emit('join_session', participant);
    };

    console.log({ sessionInfo });
    console.log({ isStarted });

    if (sessionInfo) {
        if (sessionInfo?.is_active || isStarted) {
            return <h1>PLAYING 123</h1>;
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
                    <p className="text-4xl font-black">{host_id}</p>
                </div>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <InputField
                        form={form}
                        name="name"
                        placeholder="Enter nickname"
                        size="lg"
                        className="mb-3"
                        classNames={{
                            input: '!text-center font-bold',
                        }}
                        showErrorText={false}
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
