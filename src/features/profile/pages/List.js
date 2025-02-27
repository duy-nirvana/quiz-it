import React, { useEffect, useMemo, useState } from 'react';
import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Center,
    Input,
    LoadingOverlay,
    Pagination,
    SegmentedControl,
} from '@mantine/core';
import {
    IconBrandSafari,
    IconDotsVertical,
    IconLock,
    IconPencil,
    IconSearch,
    IconUser,
    IconUserFilled,
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
    const [currentHostQuiz, setCurrentHostQuiz] = useState();
    const [tabValue, setTabValue] = useState('me');

    const [loadingList, setLoadingList] = useState(false);
    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        if (profile) {
            let queryPagination = {
                page,
                limit,
            };

            if (tabValue === 'me') {
                queryPagination['created_by'] = profile._id;
            }

            if (tabValue === 'explore') {
                // only get public quiz || exclude current user quiz
                queryPagination['is_private'] = false;
                queryPagination['excluded_id'] = profile._id;
            }

            getQuizzes(queryPagination);
        }
    }, [profile, limit, page, tabValue]);

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

    const handleChangeTab = async (value) => {
        setPage(1);
        setTabValue(value);
    };

    const getQuizzes = async (query) => {
        try {
            setLoadingList(true);

            const { data, total, success } = await quizApi.getAll(query);

            if (success) {
                setTotal(total);
                setQuizzes(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingList(false);
        }
    };

    console.log({ total });

    return (
        <div className="flex flex-1 flex-col items-center">
            <div className="w-full max-w-[1000px] lg:basis-full">
                <Input
                    placeholder="Search"
                    size="lg"
                    leftSection={<IconSearch />}
                />
                <SegmentedControl
                    value={tabValue}
                    onChange={handleChangeTab}
                    color="blue"
                    variant="gradient"
                    fullWidth
                    size="sm"
                    data={[
                        {
                            label: (
                                <Center style={{ gap: 5 }}>
                                    <IconBrandSafari
                                        size={22}
                                        className="font-bold"
                                    />
                                    <span className="font-semibold">
                                        EXPLORE
                                    </span>
                                </Center>
                            ),
                            value: 'explore',
                        },
                        {
                            label: (
                                <Center style={{ gap: 5 }}>
                                    <IconUser size={22} />
                                    <span className="font-semibold">
                                        MY QUIZ
                                    </span>
                                </Center>
                            ),
                            value: 'me',
                        },
                    ]}
                    className="my-2"
                />
                <div className="mb-3">
                    <div className="relative mb-3 flex flex-col gap-3">
                        {loadingList && (
                            <LoadingOverlay
                                visible={loadingList}
                                zIndex={1000}
                                overlayProps={{
                                    radius: 'sm',
                                    blur: 2,
                                    backgroundOpacity: 0.2,
                                }}
                                loaderProps={{ color: 'orange', size: 32 }}
                            />
                        )}
                        {!quizzes.length ? (
                            <div className="flex h-96 items-center justify-center">
                                <p className="my-2 text-center text-xl text-white">
                                    Nothing found
                                </p>
                            </div>
                        ) : (
                            <>
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
                                                className="h-full w-full rounded-md object-cover object-top"
                                            />
                                            <Badge
                                                className="absolute bottom-2 right-3 border border-slate-400"
                                                color="gray"
                                                size="sm"
                                            >
                                                {quiz?.questions?.length}{' '}
                                                Questions
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
                                                    {quiz.created_by ===
                                                        profile?._id && (
                                                        <>
                                                            <ActionIcon
                                                                variant="subtle"
                                                                color="black"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/quiz/${quiz.id}`
                                                                    )
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
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar
                                                        color="grape"
                                                        radius="xl"
                                                    >
                                                        DT
                                                    </Avatar>
                                                    <p>Duy Tran</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p>
                                                        {quiz?.play_count} plays
                                                    </p>
                                                    <Button
                                                        variant="light"
                                                        color="dark"
                                                        className="min-w-fit"
                                                        onClick={() =>
                                                            handleHostLive(quiz)
                                                        }
                                                        loading={
                                                            currentHostQuiz ===
                                                                quiz.id &&
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
                            </>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Pagination
                            value={page}
                            total={Math.ceil(total / limit)}
                            onChange={setPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default List;
