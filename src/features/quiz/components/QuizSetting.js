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
            <div className="flex grow flex-col gap-y-4 overflow-y-auto">
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
            </div>
            <div
                className={twMerge(
                    'flex justify-center gap-3 bg-slate-300 py-4',
                    collapsed && 'hidden'
                )}
            >
                <Button
                    size="md"
                    variant="light"
                    color="red"
                    leftSection={<IconTrash className="h-4 w-4" />}
                    onClick={() => onDelete(index)}
                    disabled={fields.length === 1}
                >
                    Delete
                </Button>
                <Button
                    size="md"
                    leftSection={<IconPlus className="h-4 w-4 min-w-4" />}
                    onClick={() => onDuplicate(index)}
                >
                    Duplicate
                </Button>
            </div>
        </>
    );
}

export default QuizSetting;
