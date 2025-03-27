import React from 'react';
import InputField from 'components/form-controls/InputField';
import { twMerge } from 'tailwind-merge';
import styles from './AnswerItem.module.scss';
import { Radio } from '@mantine/core';
import CheckboxField from 'components/form-controls/CheckboxField';

const answerItemStyle = ({
    form,
    isHost,
    isPlayer,
    index,
    selectedIndex,
    showResult,
    isDisabledSelect,
    isCorrect,
}) => {
    const activeClasses = 'cursor-default brightness-100 hover:brightness-100 active:brightness-100';
    const disabledClasses = 'cursor-default brightness-[45%] hover:brightness-[45%] active:brightness-[45%]'

};

function AnswertItem({
    form,
    name,
    icon,
    color = 'bg-slate-700',
    disabled,
    classNames,
    index,
    isPlaying,
    isHost,
    isPlayer,
    selectedIndex,
    onSelect = () => {},
    isDisabledSelect = false,
    showResult,
}) {
    const Icon = icon;
    const content = `${name}.text`;
    const isCorrect = `${name}.is_correct`;

    return (
        <div
            className={twMerge(
                'flex items-center gap-4 overflow-hidden rounded-lg px-4',
                color,
                styles.AnswerItemWrapper,
                isPlayer &&
                    `relative cursor-pointer hover:brightness-[80%] active:brightness-[60%]`,
                Number.isInteger(selectedIndex) &&
                    selectedIndex === index &&
                    'cursor-default brightness-100 hover:brightness-100 active:brightness-100',
                Number.isInteger(selectedIndex) &&
                    selectedIndex !== index &&
                    'cursor-default brightness-[45%] hover:brightness-[45%] active:brightness-[45%]',
                isDisabledSelect &&
                    !Number.isInteger(selectedIndex) &&
                    'cursor-default brightness-[45%] hover:brightness-[45%] active:brightness-[45%]',
                isHost &&
                    showResult &&
                    form.getValues(isCorrect) &&
                    'cursor-default brightness-100 hover:brightness-100 active:brightness-100',
                isHost &&
                    showResult &&
                    !form.getValues(isCorrect) &&
                    'cursor-default brightness-[45%] hover:brightness-[45%] active:brightness-[45%]'
            )}
        >
            {isPlayer && (
                <div
                    className="absolute bottom-0 left-0 right-0 top-0 z-[100]"
                    onClick={() =>
                        !isDisabledSelect &&
                        !Number.isInteger(selectedIndex) &&
                        onSelect()
                    }
                ></div>
            )}
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
                        if (
                            form
                                .watch(`questions.${index}.answers`)
                                .some((ans) => ans.is_correct)
                        ) {
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
