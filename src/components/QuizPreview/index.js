import { BarChart } from '@mantine/charts';
import { ActionIcon, Button, Divider, Tooltip } from '@mantine/core';
import {
    IconArrowsMaximize,
    IconBulb,
    IconChevronLeft,
    IconChevronRight,
    IconSquareFilled,
    IconSquareRotatedFilled,
    IconTriangleFilled,
    IconX,
} from '@tabler/icons-react';
import AnswertItem from 'components/AnswerItem';
import InputField from 'components/form-controls/InputField';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useParams } from 'react-router-dom';
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
}) {
    let { id: hostId } = useParams();
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

    const handleReset = () => {
        setCurrentQuizIndex(0);
        setCountdownTimeLimit(Number(form.getValues(`questions.0.time_limit`)));
    };

    console.log({ completedQuestionsRef });

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
                                                className="w-3/4 font-semibold"
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
                                                    <div className="flex h-full items-center justify-around">
                                                        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-400/50 p-20">
                                                            <p className="text-6xl font-bold text-white">
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
                                                        )}

                                                        <div>
                                                            <div className="mb-2 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-400/50 p-20">
                                                                <p className="text-6xl font-bold text-white">
                                                                    {Number.isInteger(
                                                                        submittedTotal
                                                                    )
                                                                        ? submittedTotal
                                                                        : quizList.length}
                                                                </p>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center rounded-full bg-slate-400/50 px-6 py-2">
                                                                <p className="text-lg font-bold text-white">
                                                                    SUBMITTED
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

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
                                                        <Tooltip
                                                            label="Show result"
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
                                                                <IconBulb />
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
