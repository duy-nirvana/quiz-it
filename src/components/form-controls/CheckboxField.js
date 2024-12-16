import { Checkbox, Input } from '@mantine/core';
import React from 'react';
import { Controller } from 'react-hook-form';

function CheckboxField({ form, name, ...props }) {
    return (
        <Controller
            control={form.control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <>
                    <Checkbox
                        checked={field.value}
                        onChange={(e) => field.onChange(e)}
                        withErrorStyles={false}
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

export default CheckboxField;
