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
import React from 'react';
import { twMerge } from 'tailwind-merge';

function QuizPreview({ open, onClose, children, className }) {
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
                            <div className="flex items-center gap-4 overflow-hidden rounded-lg bg-red-500 pl-4">
                                <IconTriangleFilled className="h-8 w-8 text-white" />
                                <Input
                                    placeholder="Add answer"
                                    size="xl"
                                    variant="unstyled"
                                    className="grow font-semibold"
                                    classNames={{
                                        wrapper: 'border-none ',
                                        input: twMerge(
                                            'h-28 text-black rounded-none',
                                            true && 'text-white'
                                        ),
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-4 overflow-hidden rounded-lg bg-sky-600 pl-4">
                                <IconSquareRotatedFilled className="h-8 w-8 text-white" />
                                <Input
                                    placeholder="Add answer"
                                    size="xl"
                                    variant="unstyled"
                                    className="grow font-semibold"
                                    classNames={{
                                        wrapper: 'border-none ',
                                        input: twMerge(
                                            'h-28 text-black rounded-none',
                                            true && 'text-white'
                                        ),
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-4 overflow-hidden rounded-lg bg-yellow-600 pl-4">
                                <IconCircleFilled className="h-8 w-8 text-white" />
                                <Input
                                    placeholder="Add answer"
                                    size="xl"
                                    variant="unstyled"
                                    className="grow font-semibold"
                                    classNames={{
                                        wrapper: 'border-none ',
                                        input: twMerge(
                                            'h-28 text-black rounded-none',
                                            true && 'text-white'
                                        ),
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-4 overflow-hidden rounded-lg bg-green-700 pl-4">
                                <IconSquareFilled className="h-8 w-8 text-white" />
                                <Input
                                    placeholder="Add answer"
                                    size="xl"
                                    variant="unstyled"
                                    className="grow font-semibold"
                                    classNames={{
                                        wrapper: 'border-none',
                                        input: twMerge(
                                            'h-28 text-black rounded-none',
                                            true && 'text-white'
                                        ),
                                    }}
                                />
                            </div>
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
