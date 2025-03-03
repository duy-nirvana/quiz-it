import {
    ActionIcon,
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
import Header from '../components/Header';
import { useViewportSize } from '@mantine/hooks';

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
    const { width } = useViewportSize();
    const isMobile = width < 768;

    const { id } = params;
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [initialValues, setInitialValues] = useState(null);

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

    console.log({ isMobile });

    return (
        <div className="relative h-screen min-h-0 overflow-hidden bg-indigo-950">
            <div className="flex h-full flex-col">
                <Header
                    form={form}
                    initialValues={initialValues}
                    disabled={disabled}
                    onSubmit={handleSubmit}
                    isMobile={isMobile}
                />

                <div
                    className={twMerge(
                        'flex h-screen flex-col gap-2 overflow-x-hidden px-2 pb-2 transition-all duration-300 md:flex-row',
                        collapsed && 'pr-0'
                    )}
                >
                    {/* COL 1 */}
                    <div className="order-3 flex min-w-56 basis-44 flex-row overflow-hidden rounded-lg bg-slate-300 md:order-1 md:basis-56 md:flex-col">
                        <div className="flex w-full flex-row overflow-x-auto overflow-y-hidden md:flex-col md:overflow-y-auto">
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
                                    isMobile={isMobile}
                                />
                            ))}
                        </div>
                        <div className="self-center bg-slate-300 py-4 text-center">
                            {isMobile ? (
                                <ActionIcon
                                    variant="outline"
                                    size="lg"
                                    onClick={() => {
                                        append(initialQuestion);
                                        setActiveQuestionIndex(fields.length);
                                    }}
                                    className='mx-2'
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
                            'order-1 flex h-full flex-grow flex-col justify-between gap-16 overflow-y-scroll rounded-lg bg-slate-400 px-6 py-10'
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
                            'relative order-2 hidden h-full w-[25vw] min-w-96 max-w-96 flex-col justify-between gap-2 rounded-lg bg-slate-300 px-3 py-4 transition-all md:flex',
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
