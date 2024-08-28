import { IconCopy, IconTrash, IconPhoto } from '@tabler/icons-react';
import React from 'react';
import styles from './Index.module.scss';
import { ActionIcon, Tooltip } from '@mantine/core';
import clsx from 'clsx';

function SlidePreview({
    title = 'Quiz',
    className,
    question,
    index,
    isActive,
    setActive,
}) {
    return (
        <div
            className={clsx(styles.SlidePreviewWrapper)}
            onClick={() => setActive(index)}
        >
            <div
                className={clsx('slide', isActive && 'slide-active', className)}
            >
                <div className="self-end flex flex-col">
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
                            // disabled
                        >
                            <IconTrash className="w-4 h-4" />
                        </ActionIcon>
                    </Tooltip>
                </div>
                <div className="grow">
                    <p className="text-sm font-semibold">{title}</p>
                    <div className="bg-white p-2 w-full rounded-lg flex flex-col items-center border gap-2 border-slate-400">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SlidePreview;
