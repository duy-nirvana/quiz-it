import { BarChart } from '@mantine/charts';
import { ActionIcon, Button, Divider, Tooltip } from '@mantine/core';
import {
    IconArrowsMaximize,
    IconBulb,
    IconChevronLeft,
    IconChevronRight,
    IconPhoto,
    IconSquareFilled,
    IconSquareRotatedFilled,
    IconTriangleFilled,
    IconX,
} from '@tabler/icons-react';
import { resultApi, sessionApi } from 'api';
import AnswertItem from 'components/AnswerItem';
import InputField from 'components/form-controls/InputField';
import { showToast } from 'helpers';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from 'socket';
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

const CustomXAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
        <g transform={`translate(${x},${y})`}>
            <foreignObject width="50" height="24" x={-20} y={0} color="white">
                {ANSWER_ITEMS['QUIZ'][payload.value].iconjsx}
            </foreignObject>
        </g>
    );
};

function QuizPreview({
    form,
    quizList,
    open,
    onClose,
    className,
    isPlaying,
    isHost,
    isPlayer,
    selectedIndex,
    submittedTotal,
    setSubmittedTotal,
    onSelect = () => {},
    playerCurrentQuizIndex,
    playerCountdownTimeLimit,
    showChart = true,
    participants = [],
    participantsWithScore = [],
    sessionInfo,
    participantsMapping,
}) {
    let { id: hostId } = useParams();
    const navigate = useNavigate();
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

    const timeLimit = useMemo(() => {
        return (
            Number(
                form.getValues(`questions.${currentQuizIndex}.time_limit`)
            ) || 5
        );
    }, [open, currentQuizIndex]);

    const [countdownTimeLimit, setCountdownTimeLimit] = useState(timeLimit);
    const disabledSelect = isPlayer && !countdownTimeLimit;
    const [completedQuestion, setCompletedQuestion] = useState([]);
    const completedQuestionsRef = useRef([]);
    const [showResult, setShowResult] = useState(false);
    const [finishLoading, setFinishLoading] = useState(false);

    useEffect(() => {
        if (isPlayer) return;

        setCountdownTimeLimit(timeLimit);
    }, [timeLimit, currentQuizIndex]);

    useEffect(() => {
        if (!open || isPlayer) return;

        // if (
        //     submittedTotal === participants.length &&
        //     !completedQuestionsRef.current.includes(currentQuizIndex)
        // ) {
        //     completedQuestionsRef.current.push(currentQuizIndex);
        // }

        const intervalId = setInterval(() => {
            if (
                isHost &&
                currentQuizIndex === 0 &&
                countdownTimeLimit === timeLimit
            ) {
                handleNavigate(0);
            }

            if (countdownTimeLimit > 0) {
                if (isHost) {
                    socket.emit('set_countdown_question', {
                        hostId,
                        time: countdownTimeLimit - 1,
                    });
                }
                setCountdownTimeLimit(countdownTimeLimit - 1);
            } else {
                if (isHost) {
                    if (
                        !completedQuestionsRef.current.includes(
                            currentQuizIndex
                        )
                    ) {
                        setShowResult(true);
                        completedQuestionsRef.current.push(currentQuizIndex);
                    }

                    return;
                }

                setCountdownTimeLimit(timeLimit);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [open, countdownTimeLimit]);

    useEffect(() => {
        if (playerCountdownTimeLimit >= 0) {
            setCountdownTimeLimit(playerCountdownTimeLimit);
        }
    }, [open, playerCountdownTimeLimit]);

    useEffect(() => {
        if (isPlayer && playerCurrentQuizIndex) {
            setCurrentQuizIndex(playerCurrentQuizIndex);
        }
    }, [playerCurrentQuizIndex]);

    const handleNavigate = (index) => {
        setCurrentQuizIndex(index);

        if (isHost) {
            const newDate = new Date().getTime();

            setSubmittedTotal(0);
            socket.emit('navigate_question', {
                hostId,
                questionIndex: index,
                dateTime: newDate,
            });
        }
    };

    const handleFinishQuiz = async () => {
        try {
            setFinishLoading(true);
            let correctAnswers = {};

            form.getValues('questions').forEach((question, index) => {
                correctAnswers[index] = question.answers
                    .map((ans, index) => (ans.is_correct ? index : null))
                    .filter((ans) => Number.isInteger(ans));
            });

            console.log(correctAnswers);
            console.log({ participantsWithScore });
            const calculatedScoreParticipants = participantsWithScore.map(
                (participant) => {
                    if (
                        correctAnswers[participant.questionIndex].includes(
                            participant.answerIndex
                        )
                    ) {
                        return {
                            ...participant,
                            avatar: participantsMapping[participant.socket_id]
                                .avatar,
                            user: participantsMapping[participant.socket_id]
                                .user,
                            correct_answers:
                                correctAnswers[participant.questionIndex],
                        };
                    } else {
                        return {
                            ...participant,
                            avatar: participantsMapping[participant.socket_id]
                                .avatar,
                            user: participantsMapping[participant.socket_id]
                                .user,
                            score: 0,
                            correct_answers:
                                correctAnswers[participant.questionIndex],
                        };
                    }
                }
            );

            const payload = {
                session_id: sessionInfo?._id,
                host_id: sessionInfo?.host_id,
                title: sessionInfo?.quiz?.title,
                scored_participants: calculatedScoreParticipants,
            };

            const { data, success } = await resultApi.create(payload);

            if (success) {
                socket.emit('end_game', sessionInfo?.host_id);
                // const {success: successFinishSession} = await sessionApi.finish(sessionInfo?._id);
                // if (successFinishSession) {
                // }

                navigate(`/result/${sessionInfo?.host_id}`, { state: data });
            }
            console.log({ data });
        } catch (error) {
            console.error(error);
            showToast({ type: 'error', message: 'Fail to finish quiz!' });
        } finally {
            setFinishLoading(false);
        }
    };

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
                                        'absolute left-0 top-0 z-50 h-screen w-screen bg-indigo-950 px-4 py-5 sm:px-6 sm:py-10',
                                        className
                                    )}
                                >
                                    {/* <div className="absolute right-2 top-2 z-10">
                                        <Button variant='default' leftSection={<IconBulb className='w-5 h-5 min-w-5' />}  className='text-white'>
                                            Show answers
                                        </Button>
                                    </div> */}
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
                                                className="hidden w-3/4 font-semibold sm:block"
                                                classNames={{
                                                    input: 'h-16 text-center disabled:opacity-100 disabled:text-black',
                                                }}
                                                disabled
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            {false ? (
                                                <div className="mb-6 flex justify-center">
                                                    <BarChart
                                                        h={350}
                                                        withBarValueLabel
                                                        tooltipAnimationDuration={
                                                            200
                                                        }
                                                        textColor="white"
                                                        barLabelColor="white"
                                                        data={ANSWER_ITEMS[
                                                            'QUIZ'
                                                        ].map(
                                                            (item, index) => ({
                                                                index,
                                                                value: participantsWithScore.filter(
                                                                    (
                                                                        participant
                                                                    ) =>
                                                                        participant.questionIndex ===
                                                                            currentQuizIndex &&
                                                                        participant.answerIndex ===
                                                                            index
                                                                )?.length,
                                                                color: form.getValues(
                                                                    `questions.${currentQuizIndex}.answers.${index}.is_correct`
                                                                )
                                                                    ? item.rgbaColor
                                                                    : item.rgbaColor.replace(
                                                                          '1)',
                                                                          '0.3)'
                                                                      ),
                                                            })
                                                        )}
                                                        dataKey="index"
                                                        series={[
                                                            {
                                                                name: 'value',
                                                            },
                                                        ]}
                                                        classNames={{
                                                            root: 'md:!w-3/4 lg:!w-1/2',
                                                        }}
                                                        xAxisProps={{
                                                            style: {
                                                                fontSize: 18,
                                                            },
                                                            tick: (
                                                                <CustomXAxisTick />
                                                            ),
                                                        }}
                                                        valueLabelProps={{
                                                            style: {
                                                                fontSize: 18,
                                                            },
                                                        }}
                                                        withYAxis={false}
                                                        withTooltip={false}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="hidden h-full items-center justify-around gap-2 sm:flex">
                                                        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-slate-400/50 sm:p-10 lg:h-32 lg:w-32 lg:p-20">
                                                            <p className="text-4xl font-bold text-white lg:text-6xl">
                                                                {
                                                                    countdownTimeLimit
                                                                }
                                                            </p>
                                                        </div>
                                                        {showResult ? (
                                                            <div className="mb-6 flex w-1/2 justify-center">
                                                                <BarChart
                                                                    h={350}
                                                                    withBarValueLabel
                                                                    tooltipAnimationDuration={
                                                                        200
                                                                    }
                                                                    textColor="white"
                                                                    barLabelColor="white"
                                                                    data={ANSWER_ITEMS[
                                                                        'QUIZ'
                                                                    ].map(
                                                                        (
                                                                            item,
                                                                            index
                                                                        ) => ({
                                                                            index,
                                                                            value: participantsWithScore.filter(
                                                                                (
                                                                                    participant
                                                                                ) =>
                                                                                    participant.questionIndex ===
                                                                                        currentQuizIndex &&
                                                                                    participant.answerIndex ===
                                                                                        index
                                                                            )
                                                                                ?.length,
                                                                            color: form.getValues(
                                                                                `questions.${currentQuizIndex}.answers.${index}.is_correct`
                                                                            )
                                                                                ? item.rgbaColor
                                                                                : item.rgbaColor.replace(
                                                                                      '1)',
                                                                                      '0.3)'
                                                                                  ),
                                                                        })
                                                                    )}
                                                                    dataKey="index"
                                                                    series={[
                                                                        {
                                                                            name: 'value',
                                                                        },
                                                                    ]}
                                                                    classNames={{
                                                                        root: '!w-full',
                                                                    }}
                                                                    xAxisProps={{
                                                                        style: {
                                                                            fontSize: 18,
                                                                        },
                                                                        tick: (
                                                                            <CustomXAxisTick />
                                                                        ),
                                                                    }}
                                                                    valueLabelProps={{
                                                                        style: {
                                                                            fontSize: 18,
                                                                        },
                                                                    }}
                                                                    withYAxis={
                                                                        false
                                                                    }
                                                                    withTooltip={
                                                                        false
                                                                    }
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-96 w-1/2 justify-center overflow-hidden rounded-lg bg-white lg:w-1/3">
                                                                <img
                                                                    src={getImageURL(
                                                                        quizList[
                                                                            currentQuizIndex
                                                                        ]
                                                                    )}
                                                                    className="object-fit h-full grow"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="flex flex-col items-center">
                                                            <div className="mb-2 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-slate-400/50 sm:p-10 lg:h-32 lg:w-32 lg:p-20">
                                                                <p className="text-4xl font-bold text-white lg:text-6xl">
                                                                    {Number.isInteger(
                                                                        submittedTotal
                                                                    )
                                                                        ? submittedTotal
                                                                        : quizList.length}
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center rounded-full bg-slate-400/50 sm:p-2 lg:px-6 lg:py-2">
                                                                <p className="text-sm font-bold text-white lg:text-lg">
                                                                    SUBMITTED
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <div
                                                className={twMerge(
                                                    'absolute bottom-2 left-1/2 flex w-full min-w-fit -translate-x-1/2 flex-nowrap justify-center px-4',
                                                    isPlaying &&
                                                        'translate-y static left-0 my-2 translate-x-0 self-center',
                                                    isPlayer && 'hidden'
                                                )}
                                            >
                                                <div className="flex flex-wrap gap-x-2 rounded-md bg-gray-600/50 px-3 py-2 hover:bg-gray-500/90">
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
                                                        <Tooltip
                                                            label={
                                                                showResult
                                                                    ? 'Show media'
                                                                    : 'Show result'
                                                            }
                                                            withArrow
                                                            position="left"
                                                        >
                                                            <ActionIcon
                                                                variant="subtle"
                                                                color="white"
                                                                onClick={() =>
                                                                    setShowResult(
                                                                        !showResult
                                                                    )
                                                                }
                                                            >
                                                                {showResult ? (
                                                                    <IconPhoto />
                                                                ) : (
                                                                    <IconBulb />
                                                                )}
                                                            </ActionIcon>
                                                        </Tooltip>
                                                        <Divider
                                                            orientation="vertical"
                                                            color="black"
                                                            size="sm"
                                                            className="opacity-30"
                                                        />
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="white"
                                                            disabled={
                                                                isHost ||
                                                                currentQuizIndex ===
                                                                    0
                                                            }
                                                            onClick={() =>
                                                                handleNavigate(
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
                                                            onClick={() => {
                                                                if (isHost) {
                                                                    setShowResult(
                                                                        false
                                                                    );
                                                                }
                                                                handleNavigate(
                                                                    currentQuizIndex +
                                                                        1
                                                                );
                                                            }}
                                                        >
                                                            <IconChevronRight />
                                                        </ActionIcon>
                                                    </div>
                                                    {isHost &&
                                                        quizList.length - 1 ===
                                                            currentQuizIndex && (
                                                            <Button
                                                                color="orange"
                                                                onClick={
                                                                    handleFinishQuiz
                                                                }
                                                                disabled={
                                                                    finishLoading
                                                                }
                                                                loading={
                                                                    finishLoading
                                                                }
                                                            >
                                                                Finish
                                                            </Button>
                                                        )}
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
                                        <div className="grid h-full w-full grid-cols-2 gap-3 sm:h-fit lg:gap-4">
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
                                                        isHost={isHost}
                                                        isPlayer={isPlayer}
                                                        selectedIndex={
                                                            selectedIndex
                                                        }
                                                        onSelect={() =>
                                                            onSelect(
                                                                answerIndex
                                                            )
                                                        }
                                                        index={answerIndex}
                                                        isDisabledSelect={
                                                            disabledSelect
                                                        }
                                                        showResult={showResult}
                                                    />
                                                )
                                            )}
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
