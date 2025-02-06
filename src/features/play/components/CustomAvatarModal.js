import { bigSmile } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import {
    ActionIcon,
    Badge,
    Button,
    Modal,
    SegmentedControl,
    Text,
    Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDice6Filled, IconMoodHappyFilled } from '@tabler/icons-react';
import InputField from 'components/form-controls/InputField';
import { twMerge } from 'tailwind-merge';

function CustomAvatarModal({ children, form, getRandomAvatar }) {
    const [opened, { open, close }] = useDisclosure(false);
    const { skinColor } = bigSmile.schema.properties;
    // console.log('cur values: ', form.getValues('avatar'));

    console.log({ bigSmile });

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                centered
                withCloseButton={false}
                padding={0}
                radius={10}
            >
                <div className="flex flex-col items-center gap-4 bg-indigo-900 px-4 py-3">
                    <p className="text-xl font-bold text-white">
                        Custom avatar
                    </p>
                    <div className="flex items-end justify-center gap-2">
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
                        </div>
                    </div>
                    <div className="self-start w-full text-lg font-bold text-white">
                        <div className="grid grid-cols-4 gap-2">
                            <p>Skin:</p>
                            <div className="col-span-3 flex grow justify-evenly gap-2">
                                {skinColor.default.map((color) => (
                                    <div
                                        className="h-7 min-w-7 rounded-full border-2 border-black/80"
                                        style={{
                                            backgroundColor: `#${color}`,
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button fullWidth size="lg" color="teal" onClick={close}>
                        OK
                    </Button>
                </div>
            </Modal>
            <div onClick={open}>{children}</div>
        </>
    );
}

export default CustomAvatarModal;
