import AnswertItem from 'components/AnswerItem';
import InputField from 'components/form-controls/InputField';
import React from 'react';
import { ANSWER_ITEMS } from 'utils/answerItem';

const getImageURL = (question) => {
    let url = 'https://placehold.co/600x400/EEE/31343C';

    if (question.thumbnail) {
        url = question.thumbnail;
    }

    if (question.tempImage) {
        url = URL.createObjectURL(question.tempImage);
    }

    return url;
};

function QuizDetail({ form, question, index, uploadRef, update }) {
    return (
        <>
            <InputField
                form={form}
                name={`questions.${index}.text`}
                placeholder="Your question"
                size="lg"
                className="font-semibold"
                classNames={{
                    input: 'h-16 text-center',
                }}
                showErrorText={false}
            />
            <div className="flex justify-center">
                <div
                    className="group relative flex max-h-80 min-h-72 w-full max-w-[700px] justify-center overflow-hidden rounded-lg bg-white lg:w-1/2"
                    onClick={() => uploadRef.current.click()}
                >
                    <div>
                        <img
                            src={getImageURL(question)}
                            className="object-fit h-full w-full"
                        />
                        <div className="absolute bottom-0 left-0 right-0 top-0 flex cursor-pointer items-center justify-center opacity-0 transition-all group-hover:bg-gray-500/40 group-hover:opacity-100">
                            <p
                                className="text-xl font-bold text-white"
                                style={{
                                    textShadow: '1px 1px 2px black',
                                }}
                            >
                                Upload image
                            </p>
                        </div>
                        <input
                            type="file"
                            ref={uploadRef}
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    update(index, {
                                        ...form.getValues(`questions.${index}`),
                                        tempImage: e.target.files[0],
                                    });
                                }
                            }}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ANSWER_ITEMS[form.watch(`questions.${index}.type`)].map(
                    (item, answerIndex) => (
                        <AnswertItem
                            key={answerIndex}
                            form={form}
                            name={`questions.${index}.answers.${answerIndex}`}
                            icon={item.icon}
                            color={item.color}
                            index={index}
                        />
                    )
                )}
            </div>
        </>
    );
}

export default QuizDetail;
