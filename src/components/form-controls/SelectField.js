import { Input, Select } from '@mantine/core';
import React from 'react';
import { Controller } from 'react-hook-form';

function SelectField({ form, name, mode, onChange, ...props }) {
    return (
        <Controller
            control={form.control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <>
                    {mode === 'multi' ? (
                        <MultiSelect
                            value={field.value}
                            onChange={(e) => {
                                field.onChange(e);
                                onChange && onChange(e);
                            }}
                            size="lg"
                            {...props}
                        />
                    ) : (
                        <Select
                            value={field.value.toString()}
                            onChange={(e) => {
                                field.onChange(e);
                                onChange && onChange(e);
                            }}
                            size="lg"
                            {...props}
                        />
                    )}
                    {error && (
                        <Input.Error>
                            {error.message ?? 'Field is invalid'}
                        </Input.Error>
                    )}
                </>
            )}
        />
    );
    // return <Select form={form} {...props} />;
}

export default SelectField;
