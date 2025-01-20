import * as yup from 'yup';

export const quizSchema = yup.object({
    title: yup.string().required('Title is required!'),
    questions: yup.array().of(
        yup.object({
            text: yup.string().required('Question is required!'),
        })
    ),
});
