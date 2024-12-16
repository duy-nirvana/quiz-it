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
    const content = name.toString() + '.text';
    const isCorrect = name.toString() + '.is_correct';

    console.log(form.watch(isCorrect));

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
                    'h-8 w-8 text-white transition-all',
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
                    input: 'h-28 text-black rounded-none text-white',
                }}
                disabled={disabled}
            />
            <CheckboxField
                form={form}
                name={isCorrect}
                size="lg"
                radius="xl"
                color="lime.6"
                className="hover:cursor-pointer"
                classNames={{
                    input: twMerge(
                        'border-2 !border-white bg-transparent opacity-40 transition-all hover:opacity-100 hover:cursor-pointer',
                        form.watch(isCorrect) && 'opacity-100 shadow-md'
                    ),
                }}
            />
        </div>
    );
}

export default AnswertItem;
