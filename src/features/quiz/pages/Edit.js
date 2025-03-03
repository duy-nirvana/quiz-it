import {
    Badge,
    Button,
    Divider,
    Input,
    Popover,
    Select,
    Tooltip,
} from '@mantine/core';
import {
    IconChevronLeft,
    IconChevronRight,
    IconEye,
    IconHistory,
    IconPlus,
    IconSquareFilled,
    IconSquareRotatedFilled,
    IconTrash,
    IconTriangleFilled,
} from '@tabler/icons-react';
import AnswertItem from 'components/AnswerItem';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import InputField from 'components/form-controls/InputField';
import { quizApi } from 'api';
import SelectField from 'components/form-controls/SelectField';
import SlidePreview from 'components/SlidePreview';
import QuizPreview from 'components/QuizPreview';
import { useDispatch, useSelector } from 'react-redux';
import { imgurApi } from 'api/imgurApi';
import { fetchPersonal } from 'store/personal/personalThunk';
import { generateTimeOptions, showToast } from 'helpers';
import { formatQuestions, formatQuiz } from 'helpers/quiz';
import { quizSchema } from '../schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { ANSWER_ITEMS } from 'utils/answerItem';
import { QUESTION_TYPE } from 'constants';
import QuizDetail from '../components/QuizDetail';
import QuizSetting from '../components/QuizSetting';

const timeLimitOptions = generateTimeOptions(10, 120);
console.log({ timeLimitOptions });

const initialQuestion = {
    text: '',
    answers: [
        {
            text: '',
            is_correct: false,
        },
        {
            text: '',
            is_correct: false,
        },
        {
            text: '',
            is_correct: false,
        },
        {
            text: '',
            is_correct: false,
        },
    ],
    type: 'QUIZ',
    time_limit: 60,
    point_type: 'STANDARD',
    answer_type: 'SINGLE',
};

function Edit({ disabled: disabledQuiz = false }) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const dispatch = useDispatch();
    const { id } = params;
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const [openedResetPopover, setOpenedResetPopover] = useState(false);
    const itemRefs = useRef([]);
    const uploadRef = useRef();

    const { profile } = useSelector((state) => state.personal);

    const disabled = id
        ? initialValues?.created_by !== profile?._id || disabledQuiz
        : false;

    console.log({ initialValues });

    const form = useForm({
        defaultValues: {
            title: '',
            description: '',
            is_private: false,
            questions: [initialQuestion],
        },
        resolver: yupResolver(quizSchema),
    });

    const { fields, append, update, remove, insert } = useFieldArray({
        control: form.control,
        name: 'questions',
        keyName: '_id',
    });

    // const answer = useFieldArray({
    //     control: form.control,
    //     name: 'answers',
    //     keyName: '_id',
    // });

    // const answerFields = useFieldArray({
    //     control: form.control,
    //     name: 'answers',
    // });

    useEffect(() => {
        if (!profile) {
            dispatch(fetchPersonal());
        }
    }, []);

    useEffect(() => {
        if (id) {
            getDetailQuiz();
        }
    }, [id]);

    useEffect(() => {
        if (
            activeQuestionIndex !== null &&
            itemRefs.current[activeQuestionIndex]
        ) {
            itemRefs.current[activeQuestionIndex].scrollIntoView({
                block: 'start',
            });
        }
    }, [activeQuestionIndex]);

    const getDetailQuiz = async () => {
        try {
            const { data, success } = await quizApi.getDetail(id);

            if (success) {
                form.reset(data);
                setInitialValues(data);
            }
        } catch (error) {
            console.error(error);
            showToast({ message: 'Fail to get detail quiz!', type: 'error' });
        }
    };

    const getImageURL = (question) => {
        let url = 'https://placehold.co/600x400/EEE/31343C';

        if (question.thumbnail) {
            url = question.thumbnail;
        }

        if (question.tempImage) {
            url = URL.createObjectURL(question.tempImage);
        }

        return url;
    };

    const handleDuplicate = (index) => {
        const currentQuestion = { ...form.getValues(`questions.${index}`) };
        delete currentQuestion._id;

        insert(index + 1, currentQuestion);
        setActiveQuestionIndex(index + 1);
    };

    const handleDelete = (index) => {
        remove(index);
        setActiveQuestionIndex(index > 0 ? index - 1 : index);
    };

    const handleSubmit = async (values) => {
        try {
            const formatValues = formatQuiz(values);
            console.log({ formatValues });
            debugger;
            const promiseFiles = [];
            let newQuestions = [];

            values.questions.forEach((question, index) => {
                if (question.thumbnail) return;

                if (question.tempImage) {
                    const formData = new FormData();
                    const file = question.tempImage;
                    formData.append('image', file);
                    formData.append('type', 'image');
                    formData.append('title', `title-${index}`);
                    formData.append('description', `description-${index}`);

                    promiseFiles.push(imgurApi.upload(formData));
                }
            });

            const imageUploadedList = await Promise.all(promiseFiles);

            if (imageUploadedList.length) {
                newQuestions = formatQuestions(
                    values.questions,
                    imageUploadedList
                );
                values.questions = newQuestions;
            }

            const submitValues = {
                ...formatQuiz(values),
                created_by: profile._id,
            };

            console.log({ submitValues });
            debugger;
            if (initialValues) {
                await quizApi.update(submitValues);
                showToast({
                    type: 'success',
                    message: 'Update quiz successfully!',
                });
            } else {
                await quizApi.create(submitValues);
                showToast({
                    type: 'success',
                    message: 'Create quiz successfully!',
                });
                navigate('/profile');
            }
        } catch (error) {
            showToast({
                type: 'error',
                message: `Fail to ${initialValues ? 'update' : 'create'} quiz!`,
            });
        }
    };

    console.log('watch: ', form.watch('questions'));

    return (
        <div className="relative h-screen min-h-0 overflow-hidden bg-indigo-950">
            <div className="flex h-full flex-col">
                <div className="flex justify-between p-2">
                    <div className="flex items-center gap-4">
                        <Badge
                            radius="sm"
                            variant="gradient"
                            gradient={{ from: 'cyan', to: 'violet', deg: 130 }}
                            className="h-fit cursor-pointer px-3 py-2 text-2xl"
                            onClick={() => navigate('/')}
                        >
                            <p className="font-bold">QUIZ IT</p>
                        </Badge>

                        <InputField
                            form={form}
                            name="title"
                            size="md"
                            placeholder="Enter title"
                            className="w-96 font-bold"
                            showErrorText={false}
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex gap-2">
                            <Popover
                                width={250}
                                position="left"
                                withArrow
                                shadow="md"
                                opened={openedResetPopover}
                                onClick={() =>
                                    setOpenedResetPopover(!openedResetPopover)
                                }
                            >
                                <Popover.Target>
                                    <Button
                                        size="md"
                                        leftSection={
                                            <IconHistory className="h-5 w-5" />
                                        }
                                        color="red"
                                        variant="outline"
                                    >
                                        Reset
                                    </Button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <div className="flex flex-col gap-2 text-center">
                                        <p>
                                            It's will clear everything you
                                            changed
                                        </p>
                                        <Button
                                            fullWidth
                                            color="red"
                                            onClick={() => {
                                                form.reset(initialValues);
                                                setActiveQuestionIndex(0);
                                                setOpenedResetPopover(false);
                                            }}
                                        >
                                            OK
                                        </Button>
                                    </div>
                                </Popover.Dropdown>
                            </Popover>

                            <Button
                                size="md"
                                leftSection={<IconEye className="h-5 w-5" />}
                                color="cyan"
                                onClick={() => setOpenPreview(true)}
                            >
                                Preview
                            </Button>
                        </div>
                        <Divider
                            orientation="vertical"
                            color="gray"
                            size="sm"
                        />
                        <div className="flex gap-2">
                            <Button
                                size="md"
                                variant="default"
                                onClick={() => {
                                    let state = {};

                                    if (location?.state?.quizzes?.length) {
                                        state['quizzes'] =
                                            location.state.quizzes;
                                    }

                                    if (location?.state?.from) {
                                        navigate(location?.state?.from, {
                                            state,
                                        });
                                    } else {
                                        navigate('/');
                                    }
                                }}
                            >
                                Exit
                            </Button>
                            <Tooltip
                                disabled={!disabled}
                                label="Only creator can save this quiz"
                            >
                                <Button
                                    size="md"
                                    onClick={form.handleSubmit(handleSubmit)}
                                    disabled={disabled}
                                >
                                    Save
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <div
                    className={twMerge(
                        'flex h-screen gap-2 overflow-x-hidden px-2 pb-2 transition-all duration-300',
                        collapsed && 'pr-0'
                    )}
                >
                    {/* COL 1 */}
                    <div className="flex min-w-56 basis-56 flex-col overflow-hidden rounded-lg bg-slate-300">
                        <div className="w-full overflow-y-auto">
                            {fields.map((question, index, questions) => (
                                <SlidePreview
                                    title={
                                        QUESTION_TYPE[
                                            form.getValues(
                                                `questions.${index}.type`
                                            )
                                        ].label
                                    }
                                    key={question._id}
                                    form={form}
                                    className={'p-2 pr-4'}
                                    index={index}
                                    isActive={activeQuestionIndex === index}
                                    setActive={setActiveQuestionIndex}
                                    questions={questions}
                                    onDuplicate={handleDuplicate}
                                    onDelete={handleDelete}
                                    ref={(el) => (itemRefs.current[index] = el)} // Assign ref for each item
                                />
                            ))}
                        </div>
                        <div className="bg-slate-300 py-4 text-center">
                            <Button
                                size="md"
                                leftSection={
                                    <IconPlus className="h-4 w-4 min-w-4" />
                                }
                                onClick={() => {
                                    append(initialQuestion);
                                    setActiveQuestionIndex(fields.length);
                                }}
                            >
                                Add question
                            </Button>
                        </div>
                    </div>
                    {/* COL 2 */}
                    <div
                        className={twMerge(
                            'flex h-full flex-grow flex-col justify-between gap-16 overflow-y-scroll rounded-lg bg-slate-400 px-6 py-10'
                        )}
                    >
                        {fields.map((question, index, questions) => {
                            if (index === activeQuestionIndex) {
                                return (
                                    <QuizDetail
                                        form={form}
                                        question={question}
                                        index={index}
                                        uploadRef={uploadRef}
                                    />
                                );
                            }
                        })}
                    </div>
                    {/* COL 3 */}
                    <div
                        id="col-3"
                        className={twMerge(
                            'relative flex h-full w-[25vw] min-w-96 max-w-96 flex-col justify-between gap-2 rounded-lg bg-slate-300 px-3 py-4 transition-all',
                            collapsed && 'w-0 min-w-0 translate-x-full p-0'
                        )}
                    >
                        <div
                            className={twMerge(
                                'absolute left-0 top-1/2 -translate-x-full -translate-y-full cursor-pointer rounded-l-md bg-slate-300 px-1 py-2 opacity-70 hover:opacity-100'
                            )}
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? (
                                <IconChevronLeft />
                            ) : (
                                <IconChevronRight />
                            )}
                        </div>
                        {fields.map((question, index, questions) => {
                            if (index === activeQuestionIndex) {
                                return (
                                    <QuizSetting
                                        form={form}
                                        fields={fields}
                                        index={index}
                                        timeLimitOptions={timeLimitOptions}
                                        onDelete={handleDelete}
                                        onDuplicate={handleDuplicate}
                                        collapsed={collapsed}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
            <QuizPreview
                form={form}
                quizList={fields}
                open={openPreview}
                onClose={() => setOpenPreview(false)}
            />
        </div>
    );
}

export default Edit;
