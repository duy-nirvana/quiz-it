import React from 'react';
import InputField from 'components/form-controls/InputField';
import { twMerge } from 'tailwind-merge';
import './AnswerItem.scss';

function AnswertItem({
    form,
    name,
    icon,
    color = 'bg-slate-700',
    disabled,
    classNames,
}) {
    const Icon = icon;

    return (
        <div
            className={twMerge(
                'flex items-center gap-4 overflow-hidden rounded-lg pl-4',
                color
            )}
        >
            <Icon
                className={twMerge(
                    'h-8 w-8 text-white transition-all',
                    !form.watch(name) && 'opacity-50'
                )}
            />
            <InputField
                form={form}
                name={name}
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
        </div>
    );
}

export default AnswertItem;
