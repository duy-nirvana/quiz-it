import {
    IconCheck,
    IconCircleFilled,
    IconSquareFilled,
    IconSquareRotatedFilled,
    IconTriangleFilled,
    IconX,
} from '@tabler/icons-react';

export const ANSWER_ITEMS = {
    QUIZ: [
        {
            color: 'bg-red-500',
            icon: IconTriangleFilled,
        },
        {
            color: 'bg-sky-600',
            icon: IconCircleFilled,
        },
        {
            color: 'bg-yellow-600',
            icon: IconSquareRotatedFilled,
        },
        {
            color: 'bg-green-700',
            icon: IconSquareFilled,
        },
    ],
    TRUE_OR_FALSE: [
        {
            color: 'bg-green-700',
            icon: IconCheck,
        },
        {
            color: 'bg-red-500',
            icon: IconX,
        },
    ],
};
