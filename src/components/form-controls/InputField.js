import { Input } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import React from 'react';
import { Controller } from 'react-hook-form';

function InputField({
    form,
    name,
    showErrorText = true,
    debounceTime = 0,
    onChange,
    ...props
}) {
    const callDebounce = useDebouncedCallback((e) => {
        onChange(e);
    }, debounceTime);

    return (
        <Controller
            control={form.control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <>
                    <Input
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            onChange && callDebounce(e);
                        }}
                        error={error}
                        // withErrorStyles={false}
                        {...props}
                    />
                    {error && showErrorText && (
                        <Input.Error>
                            {error.message ?? 'Field is invalid'}
                        </Input.Error>
                    )}
                </>
            )}
        />
    );
}

export default InputField;
