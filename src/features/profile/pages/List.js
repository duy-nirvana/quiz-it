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

function List(props) {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const { profile } = useSelector((state) => state.personal);

    useEffect(() => {
        if (profile) {
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
                            <div className="relative w-44">
                                <img
                                    src="https://placehold.co/300x200/EEE/31343C"
                                    className="object-fit h-full w-full min-w-28"
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
