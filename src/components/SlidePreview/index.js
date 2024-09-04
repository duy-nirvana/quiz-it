import {
    IconCopy,
    IconTrash,
    IconPhoto,
    IconAlertCircleFilled,
} from '@tabler/icons-react';
import React from 'react';
import styles from './Index.module.scss';
import { ActionIcon, Tooltip } from '@mantine/core';
import { twMerge } from 'tailwind-merge';

function SlidePreview({
    title = 'Quiz',
    className,
    question,
    index,
    isActive,
    setActive = () => {},
    disabled,
    error,
}) {
    return (
        <div className={twMerge(styles.SlidePreviewWrapper)}>
            <div
                className={twMerge(
                    'slide-container group',
                    isActive && 'slide-container-active',
                    className
                )}
                onClick={() => setActive(index)}
            >
                <div
                    className={twMerge(
                        'self-end flex flex-col opacity-0 group-hover:opacity-100',
                        isActive && 'opacity-100'
                    )}
                >
                    <Tooltip
                        label="Duplicate"
                        withArrow
                        position="right"
                        offset={2}
                        className="!bg-gray-600"
                    >
                        <ActionIcon
                            variant="subtle"
                            aria-label="copy-icon"
                            radius="xl"
                            color="blue"
                            className="mb-1 icon"
                            onClick={(e) => e.stopPropagation()}
                            disabled={disabled}
                        >
                            <IconCopy className="w-4 h-4" />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip
                        label="Delete"
                        withArrow
                        position="right"
                        offset={2}
                        className="!bg-gray-600"
                    >
                        <ActionIcon
                            variant="subtle"
                            aria-label="delete-icon"
                            radius="xl"
                            color="red"
                            className="mb-1 icon"
                            onClick={(e) => e.stopPropagation()}
                            disabled={disabled}
                        >
                            <IconTrash className="w-4 h-4" />
                        </ActionIcon>
                    </Tooltip>
                </div>
                <div className="grow">
                    <p className="text-sm font-semibold">{title}</p>
                    <div
                        className={twMerge(
                            'bg-white p-2 w-full rounded-lg flex flex-col items-center border gap-2 border-slate-400 ',
                            !isActive &&
                                'group-hover:outline group-hover:outline-1 outline-slate-600',
                            isActive &&
                                'outline outline-1 outline-sky-500 border-sky-500',
                            error && 'relative'
                        )}
                    >
                        <p className="text-sm">Question??</p>
                        <div className="flex items-center justify-center relative w-full">
                            <div className="border-slate-200 rounded-full w-6 h-6 min-w-6 flex justify-center items-center font-semibold border-2 absolute left-0">
                                <p className="text-xs text-slate-400">10</p>
                            </div>
                            <div className="border border-dashed px-4 py-2">
                                <IconPhoto className="w-4 h-4 min-w-4" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 w-full gap-1 grow">
                            <div className="answer-item selected"></div>
                            <div className="answer-item"></div>
                            <div className="answer-item"></div>
                            <div className="answer-item"></div>
                        </div>
                        {error && (
                            <Tooltip
                                label="Something went wrong"
                                withArrow
                                position="right"
                                offset={2}
                                className="!bg-red-600"
                            >
                                <div className="w-6 h-6 absolute right-0 translate-x-1/2 top-1/2 translate-y-[-50%] bg-white rounded-full">
                                    <IconAlertCircleFilled className="text-red-600" />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SlidePreview;
