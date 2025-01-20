import * as yup from 'yup';

export const quizSchema = yup.object({
    title: yup.string().required('Title is required!'),
    questions: yup.array().of(
        yup.object({
            text: yup.string().required('Question is required!'),
            answers: yup.array().of(
                yup.object().shape({
                    text: yup
                        .string()
                        .test(
                            'answer_text',
                            'please fill text ans',
                            (value, { path, createError }) => {
                                if (!value) {
                                    return createError({
                                        path, // Path to the problematic field
                                        message: 'please fill text ans',
                                    });
                                }
                                return true;
                                // return answers.some((answer) => !answer.text);
                            }
                        ),
                    is_correct: yup
                        .boolean()
                        .test(
                            'answer_correct',
                            'please check at least 1 ans',
                            (value, { from, path, createError }) => {
                                const answers = from.find(
                                    ({ value }) => 'answers' in value
                                )?.value?.answers;

                                console.log({ answers });

                                if (answers.some((ans) => ans.is_correct)) {
                                    return true;
                                }

                                return createError({
                                    path, // Path to the problematic field
                                    message: 'please check at least 1 ans',
                                });
                            }
                        ),
                })
            ),
            // .test(
            //     'at-least-one-correct',
            //     'At least one answer is choosen',
            //     (answers) =>
            //         answers.some((answer) => answer.is_correct === true)
            // ),
        })
    ),
});
