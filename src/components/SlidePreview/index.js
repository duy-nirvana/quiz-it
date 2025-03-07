import {
    IconCopy,
    IconTrash,
    IconPhoto,
    IconAlertCircleFilled,
    IconSettings,
} from '@tabler/icons-react';
import React, { forwardRef } from 'react';
import styles from './Index.module.scss';
import { ActionIcon, Tooltip } from '@mantine/core';
import { twMerge } from 'tailwind-merge';
import { ANSWER_ITEMS } from 'utils/answerItem';

function SlidePreview(
    {
        form,
        title = 'Quiz',
        className,
        questions,
        index,
        isActive,
        setActive = () => {},
        disabled,
        onDuplicate,
        onDelete,
        isMobile,
        onOpenSetting,
    },
    ref
) {
    const error = form.formState.errors?.questions?.[index];
    const errorAnswerText = error?.answers?.find((ans) => ans?.text)?.text
        ?.message;
    const errorAnswerChecked = error?.is_answer_seleted?.message;

    const errorText =
        error?.text?.message || errorAnswerText || errorAnswerChecked;

    return (
        <div ref={ref} className={twMerge(styles.SlidePreviewWrapper)}>
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
                        'flex flex-col self-end opacity-0 group-hover:opacity-100',
                        isActive && 'opacity-100'
                    )}
                >
                    <ActionIcon
                        variant="subtle"
                        aria-label="copy-icon"
                        radius="xl"
                        color="gray"
                        className="icon mb-1 lg:hidden"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenSetting(index);
                        }}
                        disabled={disabled}
                    >
                        <IconSettings className="h-5 w-5" />
                    </ActionIcon>
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
                            className="icon mb-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDuplicate(index);
                            }}
                            disabled={disabled}
                        >
                            <IconCopy className="h-4 w-4" />
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
                            className="icon mb-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(index);
                            }}
                            disabled={disabled || questions.length <= 1}
                        >
                            <IconTrash className="h-4 w-4" />
                        </ActionIcon>
                    </Tooltip>
                </div>
                <div className="min-w-40 max-w-40 flex-grow lg:w-full">
                    <p className="text-sm font-semibold">
                        {index + 1}/ {title}
                    </p>
                    <div className="relative">
                        <div
                            className={twMerge(
                                'flex max-w-full flex-shrink flex-col items-center gap-2 truncate rounded-lg border border-slate-400 bg-white p-2',
                                !isActive &&
                                    'outline-slate-600 group-hover:outline group-hover:outline-1',
                                isActive &&
                                    'border-sky-500 outline outline-1 outline-sky-500'
                            )}
                        >
                            <p className="max-w-full truncate text-sm">
                                {form
                                    .watch(`questions.${index}.text`)
                                    ?.trim() || (
                                    <span className="text-xs italic text-slate-400 font-semibold">
                                        Question
                                    </span>
                                )}
                            </p>
                            <div className="relative flex w-full items-center justify-center">
                                <div className="absolute left-0 flex h-6 w-6 min-w-6 items-center justify-center rounded-full border-2 border-slate-200 font-semibold">
                                    <p className="text-xs text-slate-400">
                                        {form.watch(
                                            `questions.${index}.time_limit`
                                        )}
                                    </p>
                                </div>
                                <div className="border border-dashed px-4 py-2">
                                    <IconPhoto className="h-4 w-4 min-w-4" />
                                </div>
                            </div>
                            <div className="grid w-full grow grid-cols-2 gap-1">
                                {/* {form
                                    .getValues(`questions.${index}.answers`)
                                    .map((answer) => (
                                        <div
                                            className={twMerge(
                                                'answer-item',
                                                answer.is_correct && 'selected'
                                            )}
                                        ></div>
                                    ))} */}
                                {ANSWER_ITEMS[
                                    form.watch(`questions.${index}.type`)
                                ].map((item, answerIndex) => (
                                    <div
                                        className={twMerge(
                                            'answer-item',
                                            form.watch(
                                                `questions.${index}.answers.${answerIndex}.is_correct`
                                            ) && 'selected'
                                        )}
                                    ></div>
                                ))}
                            </div>
                        </div>
                        {errorText && (
                            <Tooltip
                                label={errorText}
                                withArrow
                                position="right"
                                offset={2}
                                className="!bg-red-600"
                            >
                                <div className="absolute right-0 top-1/2 h-6 w-6 translate-x-1/2 translate-y-[-50%] rounded-full bg-white">
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

export default forwardRef(SlidePreview);
