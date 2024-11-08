import { Input } from '@mantine/core';
import React from 'react';
import { Controller } from 'react-hook-form';

function InputField({ form, name, ...props }) {
    return (
        <Controller
            control={form.control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <>
                    <Input
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                        error={error}
                        // withErrorStyles={false}
                        {...props}
                    />
                    {error && (
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
