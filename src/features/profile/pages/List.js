import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Center,
    CloseButton,
    LoadingOverlay,
    Pagination,
    SegmentedControl,
} from '@mantine/core';
import {
    IconBrandSafari,
    IconCalendarTime,
    IconEye,
    IconLock,
    IconPencil,
    IconSearch,
    IconUser,
    IconWorld,
} from '@tabler/icons-react';
import { quizApi } from 'api';
import { sessionApi } from 'api/sessionApi';
import InputField from 'components/form-controls/InputField';
import { format } from 'date-fns';
import { showToast } from 'helpers';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

function List(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [quizzes, setQuizzes] = useState([]);
    const { profile } = useSelector((state) => state.personal);
    const [currentHostQuiz, setCurrentHostQuiz] = useState();
    const [tabValue, setTabValue] = useState(searchParams.get('type') || 'me');

    const [loadingList, setLoadingList] = useState(false);
    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [limit, setLimit] = useState(
        parseInt(searchParams.get('limit')) || 10
    );

    const form = useForm({
        defaultValues: {
            search: searchParams.get('search') || '',
        },
    });

    useEffect(() => {
        if (profile) {
            if (location?.state?.quizzes?.length) {
                setQuizzes(location.state.quizzes);
                setTotal(location.state.total || 0);
                navigate(location.pathname + location.search, {
                    replace: true,
                });
                return;
            }

            getQuizzes({ search: form.getValues('search') });
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

    const handleSearch = async (e) => {
        let query = {};
        const search = e.target.value || '';

        if (search) {
            query['search'] = search;
        }

        getQuizzes(query);
    };

    const getQuizzes = async (query = {}) => {
        try {
            setLoadingList(true);

            let queryPagination = {
                page,
                limit,
            };

            setSearchParams({ page, ...query, type: tabValue });

            if (tabValue === 'me') {
                queryPagination['created_by'] = profile._id;
            }

            if (tabValue === 'explore') {
                // only get public quiz || exclude current user quiz
                queryPagination['is_private'] = false;
                queryPagination['excluded_id'] = profile._id;
            }

            const { data, total, success } = await quizApi.getAll({
                ...queryPagination,
                ...query,
            });

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

    const goToDetail = (quiz, quizzList) => {
        navigate(`/quiz/${quiz.id}`, {
            state: {
                from: location.pathname + location.search,
                quizzes: quizzList,
                total,
            },
        });
    };

    return (
        <div className="relative top-0 flex flex-1 flex-col items-center">
            <div className="w-full max-w-[1000px] lg:basis-full">
                <InputField
                    form={form}
                    name="search"
                    placeholder="Search"
                    size="lg"
                    leftSection={<IconSearch />}
                    className="sticky top-[60px] z-10 shadow-2xl md:shadow-none"
                    debounceTime={500}
                    onChange={handleSearch}
                    rightSection={
                        <CloseButton
                            onClick={() => {
                                form.setValue('search', '');
                                form.setFocus('search');
                                setPage(1);
                                getQuizzes();
                            }}
                            aria-label="Clear input"
                            className={twMerge(
                                'pointer-events-auto',
                                !form.watch('search') && 'hidden'
                            )}
                        />
                    }
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
                    className="sticky top-[110px] z-50 my-2"
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
                                {quizzes.map((quiz, index, quizzList) => (
                                    <div
                                        key={quiz.id}
                                        className="flex h-fit min-h-32 flex-col gap-1 rounded bg-white px-3 py-2 md:h-32 md:flex-row"
                                    >
                                        <div className="relative w-full flex-shrink-0 rounded-md bg-slate-300 md:w-44">
                                            <img
                                                src={
                                                    quiz.questions.find(
                                                        (ques) => ques.thumbnail
                                                    )?.thumbnail ||
                                                    'https://placehold.co/300x200/EEE/31343C'
                                                }
                                                className="object-fit h-full max-h-44 w-full rounded-md object-top sm:object-scale-down md:object-cover"
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
                                        <div className="flex flex-grow flex-col justify-between gap-2">
                                            <div className="flex flex-col justify-between gap-1 md:flex-row">
                                                <p className="text-bold text-xl">
                                                    {quiz?.title ?? 'Title'}
                                                </p>
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <IconCalendarTime className="h-4 w-4" />
                                                        <p className="text-sm italic">
                                                            {format(
                                                                quiz.createdAt,
                                                                'dd/MM/yyyy'
                                                            )}
                                                        </p>
                                                    </div>
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
                                                        <div>
                                                            {quiz.created_by ===
                                                            profile?._id ? (
                                                                <>
                                                                    <ActionIcon
                                                                        variant="subtle"
                                                                        color="black"
                                                                        onClick={() =>
                                                                            goToDetail(
                                                                                quiz,
                                                                                quizzList
                                                                            )
                                                                        }
                                                                    >
                                                                        <IconPencil className="text-slate-900" />
                                                                    </ActionIcon>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ActionIcon
                                                                        variant="subtle"
                                                                        color="black"
                                                                        onClick={() =>
                                                                            goToDetail(
                                                                                quiz,
                                                                                quizzList
                                                                            )
                                                                        }
                                                                    >
                                                                        <IconEye className="text-slate-900" />
                                                                    </ActionIcon>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
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
                                                    {/* feature incomplete */}
                                                    {/* <Tooltip position='right' label='not maintain feature'>
                                                        <Button
                                                            className="min-w-fit"
                                                            disabled
                                                        >
                                                            Play solo
                                                        </Button>
                                                    </Tooltip> */}
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
                            color="orange"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default List;
