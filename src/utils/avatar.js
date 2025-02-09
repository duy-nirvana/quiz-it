import { bigSmile } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

export const getParticipantAvatar = (props) => {
    return createAvatar(bigSmile, {
        accessoriesProbability: 100,
        size: 120,
        backgroundColor: ['18181b'],
        radius: 10,
        ...props,
    }).toDataUri();
};
