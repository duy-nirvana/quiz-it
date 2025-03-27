import { Button } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import SelectField from 'components/form-controls/SelectField';
import { QUESTION_TYPE } from 'constants';
import React from 'react';
import { twMerge } from 'tailwind-merge';

function QuizSetting({
    form,
    fields,
    index,
    timeLimitOptions,
    onDelete,
    onDuplicate,
    collapsed,
}) {
    return (
        <>
            <SelectField
                form={form}
                name={`questions.${index}.type`}
                label={<p>Question type</p>}
                placeholder="Pick value"
                data={Object.values(QUESTION_TYPE)}
                onChange={() => {
                    form.setValue(
                        `questions.${index}.answers`,
                        form
                            .getValues(`questions.${index}.answers`)
                            .map((ans) => ({
                                ...ans,
                                is_correct: false,
                            }))
                    );
                }}
            />
            <SelectField
                form={form}
                name={`questions.${index}.time_limit`}
                label={<p>Time limit</p>}
                placeholder="Pick value"
                data={timeLimitOptions}
            />
            {/* <SelectField
                    form={form}
                    name={`questions.${index}.point_type`}
                    label={<p>Point</p>}
                    placeholder="Pick value"
                    data={[
                        {
                            value: 'STANDARD',
                            label: 'Standard',
                        },
                        {
                            value: 'DOUBLE',
                            label: 'Double point',
                        },
                        {
                            value: 'NO',
                            label: 'No point',
                        },
                    ]}
                />
                <SelectField
                    form={form}
                    name={`questions.${index}.answer_type`}
                    label={<p>Answers options</p>}
                    placeholder="Pick value"
                    data={[
                        {
                            value: 'SINGLE',
                            label: 'Single select',
                        },
                        {
                            value: 'MULTI',
                            label: 'Multi select',
                        },
                    ]}
                /> */}
        </>
    );
}

export default QuizSetting;
