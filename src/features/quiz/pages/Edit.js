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
} from '@tabler/icons-react';
import { twMerge } from 'tailwind-merge';

function Edit(props) {
    const navigate = useNavigate();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    return (
        <div className="h-screen min-h-0 bg-indigo-950 p-2 flex flex-col gap-4 ">
            <div className="flex  justify-between">
                <div className="flex items-center gap-4">
                    <Badge
                        radius="sm"
                        variant="gradient"
                        gradient={{ from: 'cyan', to: 'violet', deg: 130 }}
                        className="h-fit px-3 py-2 cursor-pointer text-2xl"
                        onClick={() => navigate('/')}
                    >
                        <p className="font-bold ">QUIZ IT</p>
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
                        leftSection={<IconEye className="w-5 h-5" />}
                        color="cyan"
                    >
                        Preview
                    </Button>
                    <Divider orientation="vertical" color="gray" size="sm" />
                    <div className="flex gap-2">
                        <Button size="md" variant="default">
                            Exit
                        </Button>
                        <Button size="md">Save</Button>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 flex-1 overflow-auto">
                {/* COL 1 */}
                <div className="bg-slate-300 rounded-lg min-w-52 flex flex-col overflow-hidden">
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
                    <div className="text-center bg-slate-300 py-4 ">
                        <Button
                            size="md"
                            leftSection={
                                <IconPlus className="w-4 h-4 min-w-4" />
                            }
                        >
                            Add question
                        </Button>
                    </div>
                </div>

                {/* COL 2 */}
                <div className="bg-slate-400 h-full rounded-lg flex-auto py-10 px-6 flex flex-col gap-16 justify-between overflow-y-scroll">
                    <Input
                        placeholder="Your question"
                        size="lg"
                        className="font-semibold"
                        classNames={{
                            input: 'h-16 text-center',
                        }}
                    />
                    <div className="flex justify-center">
                        <div className="w-1/2 h-80 bg-white rounded-lg flex justify-center">
                            <img
                                src="https://miro.medium.com/v2/resize:fit:1400/1*rIkmavUeqyRySwlQdA9kKg.jpeg"
                                className="object-fit h-full"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-500 flex items-center gap-4 pl-4 rounded-lg overflow-hidden">
                            <IconTriangleFilled className="text-white w-8 h-8" />
                            <Input
                                placeholder="Add answer"
                                size="xl"
                                variant="unstyled"
                                className="font-semibold grow "
                                classNames={{
                                    wrapper: 'border-none ',
                                    input: twMerge(
                                        'h-28 text-black rounded-none',
                                        true && 'text-white'
                                    ),
                                }}
                            />
                        </div>
                        <div className="bg-sky-600 flex items-center gap-4 pl-4 rounded-lg overflow-hidden">
                            <IconSquareRotatedFilled className="text-white w-8 h-8" />
                            <Input
                                placeholder="Add answer"
                                size="xl"
                                variant="unstyled"
                                className="font-semibold grow "
                                classNames={{
                                    wrapper: 'border-none ',
                                    input: twMerge(
                                        'h-28 text-black rounded-none',
                                        true && 'text-white'
                                    ),
                                }}
                            />
                        </div>
                        <div className="bg-yellow-600 flex items-center gap-4 pl-4 rounded-lg overflow-hidden">
                            <IconCircleFilled className="text-white w-8 h-8" />
                            <Input
                                placeholder="Add answer"
                                size="xl"
                                variant="unstyled"
                                className="font-semibold grow "
                                classNames={{
                                    wrapper: 'border-none ',
                                    input: twMerge(
                                        'h-28 text-black rounded-none',
                                        true && 'text-white'
                                    ),
                                }}
                            />
                        </div>
                        <div className="bg-green-700 flex items-center gap-4 pl-4 rounded-lg overflow-hidden">
                            <IconSquareFilled className="text-white w-8 h-8" />
                            <Input
                                placeholder="Add answer"
                                size="xl"
                                variant="unstyled"
                                className="font-semibold grow "
                                classNames={{
                                    wrapper: 'border-none ',
                                    input: twMerge(
                                        'h-28 text-black rounded-none',
                                        true && 'text-white'
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* COL 3 */}
                <div className="bg-slate-400 h-full rounded-lg min-w-96 px-3 py-4">
                    <Select
                        label={<p>Question type</p>}
                        placeholder="Pick value"
                        data={['React', 'Angular', 'Vue', 'Svelte']}
                        size='lg'
                    />
                </div>
            </div>
        </div>
    );
}

export default Edit;
