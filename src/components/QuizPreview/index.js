import { ActionIcon, Button, Divider, Input, Tooltip } from '@mantine/core';
import {
    IconArrowsMaximize,
    IconChevronLeft,
    IconChevronRight,
    IconCircleFilled,
    IconHourglass,
    IconSquareFilled,
    IconSquareRotatedFilled,
    IconTriangleFilled,
    IconX,
} from '@tabler/icons-react';
import AnswertItem from 'components/AnswerItem';
import React from 'react';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

function QuizPreview({ open, onClose, children, className }) {
    const form = useForm({});

    return (
        <>
            {open && (
                <div
                    className={twMerge(
                        'absolute left-0 top-0 z-50 h-screen w-screen bg-indigo-950 px-6 py-10',
                        className
                    )}
                >
                    <div className="flex h-full w-full flex-1 flex-col justify-between">
                        <div className="flex justify-center">
                            <Input
                                placeholder="Your question"
                                size="lg"
                                className="w-3/4 font-semibold"
                                classNames={{
                                    input: 'h-16 text-center',
                                }}
                            />
                        </div>
                        <div>
                            <div className="flex h-full items-center justify-around">
                                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-400/50 p-20">
                                    <p className="text-6xl font-bold text-white">
                                        120
                                    </p>
                                </div>
                                <div className="flex h-80 w-1/2 justify-center rounded-lg bg-white">
                                    <img
                                        src="https://placehold.co/600x400/EEE/31343C"
                                        className="object-fit h-full"
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-400/50 p-20">
                                        <p className="text-6xl font-bold text-white">
                                            10
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center rounded-full bg-slate-400/50 px-6 py-2">
                                        <p className="text-lg font-bold text-white">
                                            ANSWERS
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid w-full grid-cols-2 gap-4">
                            <AnswertItem
                                form={form}
                                name="answer_1"
                                icon={IconTriangleFilled}
                                color="bg-red-500"
                                disabled
                            />
                            <AnswertItem
                                form={form}
                                name="answer_2"
                                icon={IconSquareRotatedFilled}
                                color="bg-sky-600"
                                disabled
                            />
                            <AnswertItem
                                form={form}
                                name="answer_3"
                                icon={IconSquareRotatedFilled}
                                color="bg-yellow-600"
                                disabled
                            />
                            <AnswertItem
                                form={form}
                                name="answer_4"
                                icon={IconSquareFilled}
                                color="bg-green-700"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                        <div className="flex gap-x-2 rounded-md bg-gray-600/50 px-3 py-2 hover:bg-gray-500/90">
                            <Button
                                variant="subtle"
                                color="white"
                                rightSection={<IconX />}
                                onClick={onClose}
                            >
                                Exit preview
                            </Button>
                            <Divider
                                orientation="vertical"
                                color="black"
                                size="sm"
                                className="opacity-30"
                            />
                            <div className="flex items-center gap-x-2">
                                <ActionIcon variant="subtle" color="white">
                                    <IconChevronLeft />
                                </ActionIcon>
                                <p className="text-white">1 of 10</p>
                                <ActionIcon variant="subtle" color="white">
                                    <IconChevronRight />
                                </ActionIcon>
                            </div>
                            <Divider
                                orientation="vertical"
                                color="black"
                                size="sm"
                                className="opacity-30"
                            />
                            <div className="flex items-center">
                                <Tooltip
                                    label="Full screen"
                                    withArrow
                                    position="right"
                                >
                                    <ActionIcon variant="subtle" color="white">
                                        <IconArrowsMaximize />
                                    </ActionIcon>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default QuizPreview;
