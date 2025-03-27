const deleteKeys = ['createdAt', 'updatedAt', '__v'];

export const formatQuiz = (quiz) => {
    const newQuiz = { ...quiz };

    const newQuestions = formatQuestions(newQuiz.questions);
    newQuiz.questions = newQuestions;

    deleteKeys.forEach((key) => delete newQuiz[key]);

    return newQuiz;
};

export const formatQuestions = (questions = [], imageUploadedList = []) => {
    const newQuestions = [...questions];

    newQuestions.forEach((question, index) => {
        if (question.thumbnail && question.tempImage) {
            delete question.thumbnail;
        }

        const newAnswers = formatAnswers(question.answers);

        if (imageUploadedList.length) {
            const questionImg = imageUploadedList.find(
                (image) => image.data.title.split('-')[1] == index
            );

            if (questionImg) {
                question.thumbnail = questionImg.data.link;
                delete question.tempImage;
            }
        }

        question.answers = newAnswers;
        question.time_limit = Number(question.time_limit);

        deleteKeys.forEach((key) => delete question[key]);
    });

    return newQuestions;
};

export const formatAnswers = (answers = []) => {
    const newAnswers = [...answers];

    newAnswers.forEach((answer) => {
        deleteKeys.forEach((key) => delete answer[key]);
    });

    return newAnswers;
};
