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
            iconjsx: <IconTriangleFilled className="w-10" />,
            rgbaColor: 'rgb(239, 68, 68, 1)'
        },
        {
            color: 'bg-sky-600',
            icon: IconCircleFilled,
            iconjsx: <IconCircleFilled className="w-10" />,
            rgbaColor: 'rgb(2, 132, 199, 1)'
        },
        {
            color: 'bg-yellow-600',
            icon: IconSquareRotatedFilled,
            iconjsx: <IconSquareRotatedFilled className="w-10" />,
            rgbaColor: 'rgb(202, 138, 4, 1)'
        },
        {
            color: 'bg-green-700',
            icon: IconSquareFilled,
            iconjsx: <IconSquareFilled className="w-10" />,
            rgbaColor: 'rgb(21, 128, 61, 1)'
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
