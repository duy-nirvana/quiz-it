import { ActionIcon, Button, Divider, Tooltip } from '@mantine/core';
import {
    IconArrowsMaximize,
    IconChevronLeft,
    IconChevronRight,
    IconSquareFilled,
    IconSquareRotatedFilled,
    IconTriangleFilled,
    IconX,
} from '@tabler/icons-react';
import AnswertItem from 'components/AnswerItem';
import InputField from 'components/form-controls/InputField';
import { useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
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

function QuizPreview({
    form,
    quizList,
    open,
    onClose,
    className,
    isPlaying,
    isPlayer,
}) {
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [isSelected, setIsSelected] = useState(false);

    const timeLimit = useMemo(() => {
        return (
            Number(
                form.getValues(`questions.${currentQuizIndex}.time_limit`)
            ) || 5
        );
    }, [open, currentQuizIndex]);

    const [countdownTimeLimit, setCountdownTimeLimit] = useState(timeLimit);

    useEffect(() => {
        setCountdownTimeLimit(timeLimit);
    }, [timeLimit, currentQuizIndex]);

    useEffect(() => {
        if (!open) return;
        const intervalId = setInterval(() => {
            if (countdownTimeLimit > 0) {
                setCountdownTimeLimit(countdownTimeLimit - 1);
            } else {
                setCountdownTimeLimit(timeLimit);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [open, countdownTimeLimit]);

    const handleReset = () => {
        setCurrentQuizIndex(0);
        setCountdownTimeLimit(Number(form.getValues(`questions.0.time_limit`)));
    };

    return (
        <>
            {open && (
                <>
                    {quizList.map((quiz, index) => {
                        if (index === currentQuizIndex) {
                            return (
                                <div
                                    className={twMerge(
                                        'absolute left-0 top-0 z-50 h-screen w-screen bg-indigo-950 px-6 py-10',
                                        className
                                    )}
                                >
                                    <div
                                        className={twMerge(
                                            'flex h-full w-full flex-1 flex-col justify-between'
                                        )}
                                    >
                                        <div className="flex justify-center">
                                            <InputField
                                                key={currentQuizIndex}
                                                form={form}
                                                name={`questions.${currentQuizIndex}.text`}
                                                size="lg"
                                                className="w-3/4 font-semibold"
                                                classNames={{
                                                    input: 'h-16 text-center disabled:opacity-100 disabled:text-black',
                                                }}
                                                disabled
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex h-full items-center justify-around">
                                                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-400/50 p-20">
                                                    <p className="text-6xl font-bold text-white">
                                                        {countdownTimeLimit}
                                                    </p>
                                                </div>
                                                <div className="flex h-96 w-1/2 justify-center overflow-hidden rounded-lg bg-white">
                                                    <img
                                                        src={getImageURL(
                                                            quizList[
                                                                currentQuizIndex
                                                            ]
                                                        )}
                                                        className="object-fit h-full"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="mb-2 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-400/50 p-20">
                                                        <p className="text-6xl font-bold text-white">
                                                            {quizList.length}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center rounded-full bg-slate-400/50 px-6 py-2">
                                                        <p className="text-lg font-bold text-white">
                                                            SUBMITTED
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={twMerge(
                                                    'absolute bottom-2 left-1/2 -translate-x-1/2',
                                                    isPlaying &&
                                                        'translate-y static left-0 my-2 translate-x-0 self-center',
                                                    isPlayer && 'hidden'
                                                )}
                                            >
                                                <div className="flex gap-x-2 rounded-md bg-gray-600/50 px-3 py-2 hover:bg-gray-500/90">
                                                    {!isPlaying && (
                                                        <>
                                                            <Button
                                                                variant="subtle"
                                                                color="white"
                                                                rightSection={
                                                                    <IconX />
                                                                }
                                                                onClick={() => {
                                                                    handleReset();
                                                                    onClose();
                                                                }}
                                                            >
                                                                Exit preview
                                                            </Button>
                                                            <Divider
                                                                orientation="vertical"
                                                                color="black"
                                                                size="sm"
                                                                className="opacity-30"
                                                            />
                                                        </>
                                                    )}
                                                    <div className="flex items-center gap-x-2">
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="white"
                                                            disabled={
                                                                currentQuizIndex ===
                                                                0
                                                            }
                                                            onClick={() =>
                                                                setCurrentQuizIndex(
                                                                    currentQuizIndex -
                                                                        1
                                                                )
                                                            }
                                                        >
                                                            <IconChevronLeft />
                                                        </ActionIcon>
                                                        <p className="text-white">
                                                            {currentQuizIndex +
                                                                1}{' '}
                                                            of {quizList.length}
                                                        </p>
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="white"
                                                            disabled={
                                                                quizList.length -
                                                                    1 ===
                                                                currentQuizIndex
                                                            }
                                                            onClick={() =>
                                                                setCurrentQuizIndex(
                                                                    currentQuizIndex +
                                                                        1
                                                                )
                                                            }
                                                        >
                                                            <IconChevronRight />
                                                        </ActionIcon>
                                                    </div>
                                                    <Divider
                                                        orientation="vertical"
                                                        color="black"
                                                        size="sm"
                                                        className="opacity-30"
                                                    />
                                                    <div className="flex items-center">
                                                        <Tooltip
                                                            label="Full screen"
                                                            withArrow
                                                            position="right"
                                                        >
                                                            <ActionIcon
                                                                variant="subtle"
                                                                color="white"
                                                            >
                                                                <IconArrowsMaximize />
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid w-full grid-cols-2 gap-4">
                                            {ANSWER_ITEMS['QUIZ'].map(
                                                (item, answerIndex) => (
                                                    <AnswertItem
                                                        key={answerIndex}
                                                        form={form}
                                                        name={`questions.${currentQuizIndex}.answers.${answerIndex}`}
                                                        icon={item.icon}
                                                        color={item.color}
                                                        disabled
                                                        isPlaying={isPlaying}
                                                        isPlayer={isPlayer}
                                                        isSelected={isSelected}
                                                        onSelect={() =>
                                                            setIsSelected(index)
                                                        }
                                                    />
                                                )
                                            )}
                                            {/* <AnswertItem
                                                form={form}
                                                name={`questions.${currentQuizIndex}.answers.0`}
                                                icon={IconTriangleFilled}
                                                color="bg-red-500"
                                                disabled
                                                isPlaying={isPlaying}
                                                isPlayer={isPlayer}
                                                isSelected={isSelected}
                                                onSelect={() => setIsSelected(true)}
                                            />
                                            <AnswertItem
                                                form={form}
                                                name={`questions.${currentQuizIndex}.answers.1`}
                                                icon={IconSquareRotatedFilled}
                                                color="bg-sky-600"
                                                disabled
                                                isPlaying={isPlaying}
                                                isPlayer={isPlayer}
                                                isSelected={isSelected}
                                                onSelect={() => setIsSelected(true)}
                                            />
                                            <AnswertItem
                                                form={form}
                                                name={`questions.${currentQuizIndex}.answers.2`}
                                                icon={IconSquareRotatedFilled}
                                                color="bg-yellow-600"
                                                disabled
                                                isPlaying={isPlaying}
                                                isPlayer={isPlayer}
                                                isSelected={isSelected}
                                                onSelect={() => setIsSelected(true)}
                                            />
                                            <AnswertItem
                                                form={form}
                                                name={`questions.${currentQuizIndex}.answers.3`}
                                                icon={IconSquareFilled}
                                                color="bg-green-700"
                                                disabled
                                                isPlaying={isPlaying}
                                                isPlayer={isPlayer}
                                                isSelected={isSelected}
                                                onSelect={() => setIsSelected(true)}
                                            /> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </>
            )}
        </>
    );
}

export default QuizPreview;
