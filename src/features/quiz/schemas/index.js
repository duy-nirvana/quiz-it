import * as yup from 'yup';

export const quizSchema = yup.object({
    title: yup.string().required('Title is required!'),
    questions: yup.array().of(
        yup.object({
            text: yup.string().required('Question is required!'),
            answers: yup.array().of(
                yup.object().shape({
                    text: yup.string().required('Answer value is required!'),
                    is_correct: yup
                        .boolean()
                        .test(
                            'answer_correct',
                            'At least one answer is choosen!',
                            (value, { from, path, createError }) => {
                                const answers = from.find(
                                    ({ value }) => 'answers' in value
                                )?.value?.answers;

                                const hasOneChecked = answers.some(
                                    (answer) => answer?.is_correct === true
                                );

                                if (hasOneChecked) {
                                    return true;
                                }

                                return createError({
                                    path: `${path.split('.').at(0)}.is_answer_seleted`,
                                    message: 'At least one answer is choosen',
                                });
                            }
                        ),
                })
            ),
        })
    ),
});
