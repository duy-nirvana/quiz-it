import { notifications } from '@mantine/notifications';

export const showToast = ({ type, title, message, ...props }) => {
    const COLOR_TYPE = {
        success: '#4BB543',
        error: 'red',
        warning: 'yellow',
    };

    notifications.show({
        color: COLOR_TYPE[type],
        title,
        message,
        autoClose: 3000,
        ...props,
    });
};
