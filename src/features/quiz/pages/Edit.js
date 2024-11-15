import {
    ActionIcon,
    Badge,
    Button,
    Divider,
    Input,
    Select,
} from '@mantine/core';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SlidePreview from '../../../components/SlidePreview';
import {
    IconChevronLeft,
    IconPlus,
    IconEye,
    IconTriangleFilled,
    IconSquareRotatedFilled,
    IconCircleFilled,
    IconSquareFilled,
    IconTrash,
    IconChevronRight,
} from '@tabler/icons-react';
import { twMerge } from 'tailwind-merge';
import QuizPreview from '../../../components/QuizPreview';
import AnswertItem from 'components/AnswerItem';
import { useForm } from 'react-hook-form';

function Edit(props) {
    const navigate = useNavigate();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const form = useForm({});

    return (
        <div className="relative h-screen min-h-0 overflow-hidden bg-indigo-950">
            <div className="flex h-full flex-col gap-4 p-2">
                <div className="flex justify-between">
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

                        <Input
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
                            <Button size="md">Save</Button>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-1 flex-nowrap gap-2 overflow-x-hidden">
                    {/* COL 1 */}
                    <div className="flex min-w-52 flex-col overflow-hidden rounded-lg bg-slate-300 transition-all">
                        <div className="overflow-y-auto">
                            {Array(6)
                                .fill(null)
                                .map((item, index) => (
                                    <SlidePreview
                                        className={'p-2 pr-4'}
                                        index={index}
                                        isActive={activeQuestionIndex === index}
                                        setActive={setActiveQuestionIndex}
                                        error
                                    />
                                ))}
                        </div>
                        <div className="bg-slate-300 py-4 text-center">
                            <Button
                                size="md"
                                leftSection={
                                    <IconPlus className="h-4 w-4 min-w-4" />
                                }
                            >
                                Add question
                            </Button>
                        </div>
                    </div>
                    {/* COL 2 */}
                    <div
                        className={twMerge(
                            'flex h-full flex-grow flex-col justify-between gap-16 overflow-y-scroll rounded-lg bg-slate-400 px-6 py-10 transition-all duration-300',
                            collapsed &
                                'w-full flex-1 transition-all duration-300'
                        )}
                    >
                        <Input
                            placeholder="Your question"
                            size="lg"
                            className="font-semibold"
                            classNames={{
                                input: 'h-16 text-center',
                            }}
                        />
                        <div className="flex justify-center">
                            <div className="flex h-80 w-1/2 justify-center rounded-lg bg-white">
                                <img
                                    src="https://placehold.co/600x400/EEE/31343C"
                                    className="object-fit h-full"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <AnswertItem
                                form={form}
                                name="answer_1"
                                icon={IconTriangleFilled}
                                color="bg-red-500"
                            />
                            <AnswertItem
                                form={form}
                                name="answer_2"
                                icon={IconSquareRotatedFilled}
                                color="bg-sky-600"
                            />
                            <AnswertItem
                                form={form}
                                name="answer_3"
                                icon={IconSquareRotatedFilled}
                                color="bg-yellow-600"
                            />
                            <AnswertItem
                                form={form}
                                name="answer_4"
                                icon={IconSquareFilled}
                                color="bg-green-700"
                            />
                        </div>
                    </div>
                    {/* COL 3 */}
                    <div
                        className={twMerge(
                            'relative flex h-full basis-96 flex-col justify-between gap-2 rounded-lg bg-slate-300 px-3 py-4 transition-all duration-300',
                            collapsed &&
                                'absolute right-0 translate-x-full transition-all duration-300'
                        )}
                    >
                        <div
                            className={twMerge(
                                'absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 cursor-pointer rounded-l-md bg-slate-300 px-1 py-2 opacity-70 hover:opacity-100',
                                collapsed && 'top-[calc(50%-42px+4px)]'
                            )}
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? (
                                <IconChevronLeft />
                            ) : (
                                <IconChevronRight />
                            )}
                        </div>
                        <div className="flex grow flex-col gap-y-4 overflow-y-auto">
                            <Select
                                label={<p>Question type</p>}
                                placeholder="Pick value"
                                data={['Quiz', 'True or False']}
                                size="lg"
                            />
                            <Select
                                label={<p>Time limit</p>}
                                placeholder="Pick value"
                                data={['5s', '10s', '15s', '20s']}
                                size="lg"
                            />
                            <Select
                                label={<p>Point</p>}
                                placeholder="Pick value"
                                data={['Standard', 'Double point', 'No point']}
                                size="lg"
                            />
                            <Select
                                label={<p>Answers options</p>}
                                placeholder="Pick value"
                                data={['Single select', 'Multi select']}
                                size="lg"
                            />
                        </div>
                        <div
                            className={
                                'flex justify-center gap-3 bg-slate-300 py-4'
                            }
                        >
                            <Button
                                size="md"
                                variant="light"
                                color="red"
                                leftSection={<IconTrash className="h-4 w-4" />}
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
