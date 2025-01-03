import { Badge, Button, Divider, Input, Select } from '@mantine/core';
import {
    IconChevronLeft,
    IconChevronRight,
    IconEye,
    IconPlus,
    IconSquareFilled,
    IconSquareRotatedFilled,
    IconTrash,
    IconTriangleFilled,
} from '@tabler/icons-react';
import AnswertItem from 'components/AnswerItem';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import InputField from 'components/form-controls/InputField';
import { quizApi } from 'api';
import SelectField from 'components/form-controls/SelectField';
import SlidePreview from 'components/SlidePreview';
import QuizPreview from 'components/QuizPreview';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { imgurApi } from 'api/imgurApi';

const initialQuestion = {
    text: 'What is 1 + 1 = ?',
    answers: [
        {
            text: '1',
            is_correct: false,
        },
        {
            text: '2',
            is_correct: false,
        },
        {
            text: '3',
            is_correct: false,
        },
        {
            text: '4',
            is_correct: false,
        },
    ],
    type: 'QUIZ',
    time_limit: 5,
    point_type: 'STANDARD',
    answer_type: 'SINGLE',
};

const getImageURL = (form, index) => {
    let url = 'https://placehold.co/600x400/EEE/31343C';

    if (form.getValues(`questions.${index}.thumbnail`)) {
        url = form.getValues(`questions.${index}.thumbnail`);
    }

    if (form.getValues(`questions.${index}.temp_image`)) {
        url = URL.createObjectURL(
            form.getValues(`questions.${index}.temp_image`)
        );
    }

    return url;
};

function Edit(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const { id } = params;
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const { profile } = useSelector((state) => state.personal);

    const uploadRef = useRef();
    const [file, setFile] = useState();

    const fileURL = file ? URL.createObjectURL(file) : '';
    console.log({ fileURL });

    const form = useForm({
        defaultValues: {
            title: '',
            description: '',
            is_private: false,
            questions: [initialQuestion],
        },
    });

    const { fields, append, update } = useFieldArray({
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
        if (id) {
            const getDetailQuiz = async () => {
                const { data, success } = await quizApi.getDetail(id);

                if (success) {
                    form.reset(data);
                }
            };

            getDetailQuiz();
        }
    }, [id]);

    const getImageURL = (question) => {
        let url = 'https://placehold.co/600x400/EEE/31343C';

        if (question.thumbnail) {
            url = question.thumbnail;
        }

        console.log({ question });
        if (question.tempImage) {
            url = URL.createObjectURL(question.tempImage);
        }

        return url;
    };

    console.log('AAAAAADFSADAS: ', process.env.REACT_APP_IMGUR_API_URL);

    const handleSubmit = async (values) => {
        console.log({ file });
        console.log({ values });
        const promiseFiles = [];

        values.questions.forEach((question, index) => {
            if (question.thumbnail) return;

            const formData = new FormData();
            const file = question.tempImage;
            formData.append('image', file);
            formData.append('type', 'image');
            formData.append('title', `title-${index}`);
            formData.append('description', `description-${index}`);

            promiseFiles.push(imgurApi.upload(formData));
        });

        const imageUploadedList =  await Promise.all(promiseFiles);

        const newQuestions = values.questions.map((question, index) => {
            delete question._id;
            delete question.tempImage;
            delete question.thumbnail;

            const questionImg = imageUploadedList.find(image => image.data.title.split('-')[1] == index);
            debugger
            return {
                ...question,
                thumbnail: questionImg.data.link
            }
        });

        values.questions = newQuestions;

        const submitValues = {
            ...values,
            created_by: profile._id,
        };

        debugger
        await quizApi.create(submitValues);
    };

    console.log('WATCH FORM: ', form.watch());
    console.log({ fields });

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
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button
                            size="md"
                            leftSection={<IconEye className="h-5 w-5" />}
                            color="cyan"
                            onClick={() => setOpenPreview(true)}
                        >
                            Preview
                        </Button>
                        <Divider
                            orientation="vertical"
                            color="gray"
                            size="sm"
                        />
                        <div className="flex gap-2">
                            <Button size="md" variant="default">
                                Exit
                            </Button>
                            <Button
                                size="md"
                                onClick={form.handleSubmit(handleSubmit)}
                            >
                                Save
                            </Button>
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
                                    key={question._id}
                                    form={form}
                                    className={'p-2 pr-4'}
                                    index={index}
                                    isActive={activeQuestionIndex === index}
                                    setActive={setActiveQuestionIndex}
                                    questions={questions}
                                    // error
                                />
                            ))}
                            {/* {Array(6)
                                .fill(null)
                                .map((item, index) => (
                                    <SlidePreview
                                        form={form}
                                        className={'p-2 pr-4'}
                                        index={index}
                                        isActive={activeQuestionIndex === index}
                                        setActive={setActiveQuestionIndex}
                                        error
                                    />
                                ))} */}
                        </div>
                        <div className="bg-slate-300 py-4 text-center">
                            <Button
                                size="md"
                                leftSection={
                                    <IconPlus className="h-4 w-4 min-w-4" />
                                }
                                onClick={() => append(initialQuestion)}
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
                                    <>
                                        <InputField
                                            form={form}
                                            name={`questions.${index}.text`}
                                            placeholder="Your question"
                                            size="lg"
                                            className="font-semibold"
                                            classNames={{
                                                input: 'h-16 text-center',
                                            }}
                                        />
                                        <div className="flex justify-center">
                                            <div
                                                className="group relative flex max-h-80 min-h-72 w-1/2 justify-center overflow-hidden rounded-lg bg-white"
                                                onClick={() =>
                                                    uploadRef.current.click()
                                                }
                                            >
                                                <div>
                                                    <img
                                                        src={getImageURL(
                                                            question
                                                        )}
                                                        className="object-fit h-full"
                                                    />
                                                    <div className="absolute bottom-0 left-0 right-0 top-0 flex cursor-pointer items-center justify-center opacity-0 transition-all group-hover:bg-gray-500/40 group-hover:opacity-100">
                                                        <p
                                                            className="text-xl font-bold text-white"
                                                            style={{
                                                                textShadow:
                                                                    '1px 1px 2px black',
                                                            }}
                                                        >
                                                            Upload image
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        ref={uploadRef}
                                                        onChange={(e) => {
                                                            if (
                                                                e.target
                                                                    .files[0]
                                                            ) {
                                                                update(index, {
                                                                    ...question,
                                                                    tempImage:
                                                                        e.target
                                                                            .files[0],
                                                                });
                                                            }
                                                        }}
                                                        className="hidden"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <AnswertItem
                                                form={form}
                                                name={`questions.${index}.answers.0`}
                                                icon={IconTriangleFilled}
                                                color="bg-red-500"
                                            />
                                            <AnswertItem
                                                form={form}
                                                name={`questions.${index}.answers.1`}
                                                icon={IconSquareRotatedFilled}
                                                color="bg-sky-600"
                                            />
                                            <AnswertItem
                                                form={form}
                                                name={`questions.${index}.answers.2`}
                                                icon={IconSquareRotatedFilled}
                                                color="bg-yellow-600"
                                            />
                                            <AnswertItem
                                                form={form}
                                                name={`questions.${index}.answers.3`}
                                                icon={IconSquareFilled}
                                                color="bg-green-700"
                                            />
                                        </div>
                                    </>
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
                                    <>
                                        <div className="flex grow flex-col gap-y-4 overflow-y-auto">
                                            <SelectField
                                                form={form}
                                                name={`questions.${index}.type`}
                                                label={<p>Question type</p>}
                                                placeholder="Pick value"
                                                data={[
                                                    {
                                                        value: 'QUIZ',
                                                        label: 'Quiz',
                                                    },
                                                    {
                                                        value: 'TRUE_OR_FALSE',
                                                        label: 'True or False',
                                                    },
                                                ]}
                                            />
                                            <SelectField
                                                form={form}
                                                name={`questions.${index}.time_limit`}
                                                label={<p>Time limit</p>}
                                                placeholder="Pick value"
                                                data={[
                                                    {
                                                        value: '5',
                                                        label: '5s',
                                                    },
                                                    {
                                                        value: '10',
                                                        label: '10s',
                                                    },
                                                    {
                                                        value: '15',
                                                        label: '15s',
                                                    },
                                                    {
                                                        value: '20',
                                                        label: '20s',
                                                    },
                                                ]}
                                            />
                                            <SelectField
                                                form={form}
                                                name={`questions.${index}.point_type`}
                                                label={<p>Point</p>}
                                                placeholder="Pick value"
                                                data={[
                                                    {
                                                        value: 'STANDARD',
                                                        label: 'Standard',
                                                    },
                                                    {
                                                        value: 'DOUBLE',
                                                        label: 'Double point',
                                                    },
                                                    {
                                                        value: 'NO',
                                                        label: 'No point',
                                                    },
                                                ]}
                                            />
                                            <SelectField
                                                form={form}
                                                name={`questions.${index}.answer_type`}
                                                label={<p>Answers options</p>}
                                                placeholder="Pick value"
                                                data={[
                                                    {
                                                        value: 'SINGLE',
                                                        label: 'Single select',
                                                    },
                                                    {
                                                        value: 'MULTI',
                                                        label: 'Multi select',
                                                    },
                                                ]}
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
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                size="md"
                                                leftSection={
                                                    <IconPlus className="h-4 w-4 min-w-4" />
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
                open={openPreview}
                onClose={() => setOpenPreview(false)}
            />
        </div>
    );
}

export default Edit;
