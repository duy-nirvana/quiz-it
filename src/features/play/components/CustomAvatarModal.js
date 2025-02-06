import { bigSmile } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import {
    ActionIcon,
    Badge,
    Modal,
    SegmentedControl,
    Text,
    Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDice6Filled, IconMoodHappyFilled } from '@tabler/icons-react';
import InputField from 'components/form-controls/InputField';

function CustomAvatarModal({ children, form, getRandomAvatar }) {
    const [opened, { open, close }] = useDisclosure(false);

    console.log('cur values: ', form.getValues('avatar'));

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={<p className="text-bold text-xl">Custom avatar</p>}
                centered
                classNames={{
                    header: 'bg-indigo-900',
                    body: 'bg-indigo-900',
                }}
            >
                <div className="flex w-fit items-end gap-2 self-center">
                    <img
                        src={createAvatar(bigSmile, {
                            accessoriesProbability: 100,
                            size: 120,
                            backgroundColor: ['18181b'],
                            radius: 10,
                            ...form.watch('avatar'),
                        }).toDataUri()}
                    />
                    <div className="flex flex-col">
                        <Tooltip label="Random avatar" position="right">
                            <ActionIcon
                                variant="subtle"
                                color="white"
                                onClick={getRandomAvatar}
                            >
                                <IconDice6Filled />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Custom avatar" position="right">
                            <ActionIcon variant="subtle" color="white">
                                <IconMoodHappyFilled />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                </div>
            </Modal>
            <div onClick={open}>{children}</div>
        </>
    );
}

export default CustomAvatarModal;
