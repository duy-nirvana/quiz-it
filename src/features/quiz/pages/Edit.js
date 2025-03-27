import {
    ActionIcon,
    Badge,
    Button,
    Divider,
    Input,
    Modal,
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
import Header from '../components/Header';
import { useViewportSize } from '@mantine/hooks';

const timeLimitOptions = generateTimeOptions(10, 120);

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
    const { width } = useViewportSize();
    const isMobile = width < 768;

    const { id } = params;
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const [indexQuizSetting, setIndexQuizSetting] = useState(0);
    const [openQuizSetting, setOpenQuizSetting] = useState(false);

    const itemRefs = useRef([]);
    const uploadRef = useRef();

    const { profile } = useSelector((state) => state.personal);

    const disabled = id
        ? initialValues?.created_by !== profile?._id || disabledQuiz
        : false;

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

    useEffect(() => {
        if (!isMobile) {
            setOpenQuizSetting(false);
        }
    }, [isMobile]);

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

    return (
        <div className="relative h-screen min-h-0 overflow-hidden bg-indigo-950">
            <div className="flex h-full flex-col">
                <Header
                    form={form}
                    isMobile={isMobile}
                    initialValues={initialValues}
                    disabled={disabled}
                    onSubmit={handleSubmit}
                    setActiveQuestionIndex={setActiveQuestionIndex}
                    setOpenPreview={setOpenPreview}
                />

                <div
                    className={twMerge(
                        'flex h-screen flex-col gap-2 overflow-x-hidden px-2 pb-2 transition-all duration-300 lg:flex-row',
                        collapsed && 'pr-0'
                    )}
                >
                    {/* COL 1 */}
                    <div className="order-3 flex min-w-56 basis-44 flex-row overflow-hidden rounded-lg bg-slate-300 lg:order-1 lg:basis-56 lg:flex-col">
                        <div className="flex w-full flex-row overflow-x-auto overflow-y-hidden lg:flex-col lg:overflow-y-auto">
                            {fields.map((question, index, questions) => (
                                <SlidePreview
                                    ref={(el) => (itemRefs.current[index] = el)}
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
                                    isMobile={isMobile}
                                    onOpenSetting={(index) => {
                                        setOpenQuizSetting(true);
                                        setIndexQuizSetting(index);
                                    }}
                                />
                            ))}
                        </div>
                        <div className="self-center bg-slate-300 px-2 py-4 text-center">
                            {isMobile ? (
                                <ActionIcon
                                    variant="outline"
                                    size="lg"
                                    onClick={() => {
                                        append(initialQuestion);
                                        setActiveQuestionIndex(fields.length);
                                    }}
                                    className="mx-2"
                                >
                                    <IconPlus />
                                </ActionIcon>
                            ) : (
                                <Button
                                    size={'md'}
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
                            )}
                        </div>
                    </div>
                    {/* COL 2 */}
                    <div
                        className={twMerge(
                            'order-1 flex h-full flex-grow flex-col justify-between gap-8 overflow-y-scroll rounded-lg bg-slate-400 px-6 py-10 lg:gap-16'
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
                                        update={update}
                                    />
                                );
                            }
                        })}
                    </div>
                    {/* COL 3 */}
                    <div
                        id="col-3"
                        className={twMerge(
                            'relative order-2 hidden h-full w-[25vw] min-w-96 max-w-96 flex-col justify-between gap-2 rounded-lg bg-slate-300 px-3 py-4 transition-all lg:flex',
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
                                    <>
                                        <div className="flex grow flex-col gap-y-4 overflow-y-auto">
                                            <QuizSetting
                                                form={form}
                                                index={index}
                                                timeLimitOptions={
                                                    timeLimitOptions
                                                }
                                            />
                                        </div>
                                        <div
                                            className={twMerge(
                                                'flex justify-center gap-3 bg-slate-300 py-4',
                                                collapsed && 'hidden'
                                            )}
                                        >
                                            <Button
                                                size="md"
                                                variant="light"
                                                color="red"
                                                leftSection={
                                                    <IconTrash className="h-4 w-4" />
                                                }
                                                onClick={() =>
                                                    handleDelete(index)
                                                }
                                                disabled={fields.length === 1}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                size="md"
                                                leftSection={
                                                    <IconPlus className="h-4 w-4 min-w-4" />
                                                }
                                                onClick={() =>
                                                    handleDelete(index)
                                                }
                                            >
                                                Duplicate
                                            </Button>
                                        </div>
                                    </>
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
            <Modal
                opened={openQuizSetting}
                onClose={() => setOpenQuizSetting(false)}
                centered
            >
                <div className="flex flex-col gap-4">
                    <QuizSetting
                        form={form}
                        index={indexQuizSetting}
                        timeLimitOptions={timeLimitOptions}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default Edit;
