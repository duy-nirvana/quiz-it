import React, { useEffect, useState } from 'react';
import { ActionIcon, Avatar, Badge, Button, Input } from '@mantine/core';
import {
    IconDotsVertical,
    IconLock,
    IconPencil,
    IconSearch,
    IconWorld,
} from '@tabler/icons-react';
import { quizApi } from 'api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HostLiveModal from '../components/HostLiveModal';
import { useForm } from 'react-hook-form';
import { sessionApi } from 'api/sessionApi';
import { showToast } from 'helpers';

function List(props) {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const { profile } = useSelector((state) => state.personal);
    const [loading, setLoading] = useState(false);
    const [currentHostQuiz, setCurrentHostQuiz] = useState();

    useEffect(() => {
        if (profile && !quizzes.length) {
            const getQuizzes = async () => {
                const { data, success } = await quizApi.getAll({
                    created_by: profile._id,
                });

                if (success) {
                    setQuizzes(data);
                }
            };

            getQuizzes();
        }
    }, [profile]);

    const handleHostLive = async (quiz) => {
        try {
            setCurrentHostQuiz(quiz.id);
            setLoading(true);

            // do sth
            const { data } = await sessionApi.create({
                quiz_id: quiz.id,
                host_user: profile._id,
            });
            console.log({ data });
            if (data.host_id) {
                navigate(`/host/${data.host_id}`, { state: data });
            }
        } catch (error) {
            console.error(error);
            showToast({ type: 'error', message: 'Fail to host live!' });
        } finally {
            setCurrentHostQuiz(null);
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-2 lg:col-start-2">
                <Input
                    placeholder="Search"
                    size="lg"
                    leftSection={<IconSearch />}
                />
                <div className="my-3 flex flex-col gap-4">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="flex h-32 min-h-32 gap-1 rounded bg-white px-3 py-2"
                        >
                            <div className="relative w-44 flex-shrink-0">
                                <img
                                    src={
                                        quiz.questions.find(
                                            (ques) => ques.thumbnail
                                        )?.thumbnail ||
                                        'https://placehold.co/300x200/EEE/31343C'
                                    }
                                    className="h-full w-full object-cover object-top"
                                />
                                <Badge
                                    className="absolute bottom-2 right-3 border border-slate-400"
                                    color="gray"
                                    size="sm"
                                >
                                    {quiz?.questions?.length} Questions
                                </Badge>
                            </div>
                            <div className="flex flex-grow flex-col justify-between">
                                <div className="flex justify-between">
                                    <p className="text-bold text-xl">
                                        {quiz?.title ?? 'Title'}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {quiz?.is_private ? (
                                            <Badge
                                                color="red"
                                                leftSection={
                                                    <IconLock className="h-4 w-4" />
                                                }
                                            >
                                                Private
                                            </Badge>
                                        ) : (
                                            <Badge
                                                color="teal"
                                                leftSection={
                                                    <IconWorld className="h-4 w-4" />
                                                }
                                            >
                                                Public
                                            </Badge>
                                        )}
                                        <ActionIcon
                                            variant="subtle"
                                            color="black"
                                            onClick={() =>
                                                navigate(`/quiz/${quiz.id}`)
                                            }
                                        >
                                            <IconPencil className="text-slate-900" />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="subtle"
                                            color="black"
                                        >
                                            <IconDotsVertical className="text-slate-900" />
                                        </ActionIcon>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar color="grape" radius="xl">
                                            DT
                                        </Avatar>
                                        <p>Duy Tran</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p>{quiz?.play_count} plays</p>
                                        <Button
                                            variant="light"
                                            color="dark"
                                            className="min-w-fit"
                                            onClick={() => handleHostLive(quiz)}
                                            loading={
                                                currentHostQuiz === quiz.id &&
                                                loading
                                            }
                                            disabled={loading}
                                        >
                                            Host live
                                        </Button>
                                        <Button className="min-w-fit">
                                            Play solo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default List;
