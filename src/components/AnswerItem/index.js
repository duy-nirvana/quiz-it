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
}) {
    const Icon = icon;
    const content = `${name}.text`;
    const isCorrect = `${name}.is_correct`;

    return (
        <div
            className={twMerge(
                'flex items-center gap-4 overflow-hidden rounded-lg px-4',
                color,
                styles.AnswerItemWrapper
            )}
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
                    input: 'h-28 text-black rounded-none text-white disabled:text-white',
                }}
                disabled={disabled}
            />
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
            />
        </div>
    );
}

export default AnswertItem;
