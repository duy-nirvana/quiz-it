import React from 'react';
import InputField from 'components/form-controls/InputField';
import { twMerge } from 'tailwind-merge';
import styles from './AnswerItem.module.scss';
import { Radio } from '@mantine/core';
import CheckboxField from 'components/form-controls/CheckboxField';

function AnswertItem({
    form,
    name,
    icon,
    color = 'bg-slate-700',
    disabled,
    classNames,
    index,
    isPlaying,
    isPlayer,
    isSelected,
    onSelect = () => {},
}) {
    const Icon = icon;
    const content = `${name}.text`;
    const isCorrect = `${name}.is_correct`;

    console.log({ isSelected });

    return (
        <div
            className={twMerge(
                'flex items-center gap-4 overflow-hidden rounded-lg px-4',
                color,
                styles.AnswerItemWrapper,
                isPlayer &&
                    'cursor-pointer hover:brightness-[80%] active:brightness-[60%]'
            )}
            onClick={() => !isSelected && onSelect()}
        >
            <Icon
                className={twMerge(
                    'h-8 w-8 min-w-8 text-white transition-all',
                    !form.watch(content) && 'opacity-50'
                )}
            />
            <InputField
                form={form}
                name={content}
                placeholder="Add answer"
                size="xl"
                variant="unstyled"
                className={twMerge(
                    'grow font-semibold',
                    disabled && 'opacity-100'
                )}
                classNames={{
                    wrapper: 'border-none',
                    input: twMerge(
                        'h-28 text-black rounded-none text-white disabled:text-white border-none',
                        isPlayer && '!cursor-pointer'
                    ),
                }}
                disabled={disabled}
                showErrorText={false}
            />
            {!isPlaying && (
                <CheckboxField
                    form={form}
                    name={isCorrect}
                    size="lg"
                    radius="xl"
                    color="lime.6"
                    className={twMerge(
                        'hover:cursor-pointer',
                        disabled && 'hover:cursor-default'
                    )}
                    classNames={{
                        input: twMerge(
                            'border-2 !border-white bg-transparent opacity-40 transition-all hover:opacity-100 hover:cursor-pointer  disabled:cursor-auto',
                            form.watch(isCorrect) && 'opacity-100 shadow-md',
                            disabled && 'pointer-events-none'
                        ),
                    }}
                    showErrorText={false}
                    onChange={() => {
                        const path = `${name.split('.').slice(0, -1).join('.')}`;
                        if (
                            form
                                .watch(`questions.${index}.answers`)
                                .some((ans) => ans.is_correct)
                        ) {
                            // form.clearErrors(path);
                            form.clearErrors(
                                `questions.${index}.is_answer_seleted`
                            );
                        } else if (form.formState.isSubmitted) {
                            form.setError(
                                `questions.${index}.is_answer_seleted`,
                                {
                                    message: 'At least one answer is chosen!',
                                }
                            );
                        }
                    }}
                />
            )}
        </div>
    );
}

export default AnswertItem;
