import { bigSmile } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { ActionIcon, Button, Modal, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconChevronLeft,
    IconChevronRight,
    IconDice6Filled,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getParticipantAvatar } from 'utils/avatar';

function SelectColor({ form, name, property }) {
    return (
        <div className="flex grow flex-wrap justify-around gap-2">
            {property.map((color, index) => (
                <div
                    key={index}
                    className="h-7 min-w-7 cursor-pointer rounded-full border-2 border-black/80"
                    style={{
                        backgroundColor: `#${color}`,
                    }}
                    onClick={() => form.setValue(name, [color])}
                ></div>
            ))}
        </div>
    );
}

function SelectProperty({ form, name, property }) {
    const [activeIndex, setActiveIndex] = useState(
        property.findIndex((value) => value === form.watch(`${name}.0`)) || 0
    );

    useEffect(() => {
        setActiveIndex(
            property.findIndex((value) => value === form.watch(`${name}.0`)) ||
                0
        );
    }, [form.getValues('avatar')]);

    const formatName = (value) => {
        const result = value.replace(/([A-Z])/g, ' $1').toLowerCase();
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    return (
        <div className="flex grow justify-around gap-2">
            <ActionIcon
                variant="light"
                color="white"
                onClick={() => {
                    const newIndex =
                        activeIndex > 0 ? activeIndex - 1 : property.length - 1;
                    setActiveIndex(newIndex);
                    form.setValue(`${name}`, [property[newIndex]]);
                }}
            >
                <IconChevronLeft />
            </ActionIcon>
            <div className="flex flex-1 justify-center">
                {formatName(property[activeIndex])}
            </div>
            <ActionIcon
                variant="light"
                color="white"
                onClick={() => {
                    const newIndex =
                        activeIndex < property.length - 1 ? activeIndex + 1 : 0;
                    setActiveIndex(newIndex);
                    form.setValue(`${name}`, [property[newIndex]]);
                }}
            >
                <IconChevronRight />
            </ActionIcon>
        </div>
    );
}

function CustomAvatarModal({ children, form, getRandomAvatar }) {
    const [opened, { open, close }] = useDisclosure(false);
    const { skinColor, hair, hairColor, eyes, mouth, accessories } =
        bigSmile.schema.properties;

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
                            src={getParticipantAvatar({
                                ...form.watch('avatar'),
                            })}
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
                    <div className="w-full self-start text-lg font-bold text-white">
                        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                            <p>Skin:</p>
                            <div className="col-span-3">
                                <SelectColor
                                    form={form}
                                    name="avatar.skinColor"
                                    property={skinColor.default}
                                />
                            </div>
                        </div>
                        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                            <p>Hair:</p>
                            <div className="col-span-3">
                                <SelectProperty
                                    form={form}
                                    name="avatar.hair"
                                    property={hair.default}
                                />
                            </div>
                        </div>
                        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                            <p>Hair color:</p>
                            <div className="col-span-3">
                                <SelectColor
                                    form={form}
                                    name="avatar.hairColor"
                                    property={hairColor.default}
                                />
                            </div>
                        </div>
                        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                            <p>Eye:</p>
                            <div className="col-span-3">
                                <SelectProperty
                                    form={form}
                                    name="avatar.eyes"
                                    property={eyes.default}
                                />
                            </div>
                        </div>
                        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                            <p>Mouth:</p>
                            <div className="col-span-3">
                                <SelectProperty
                                    form={form}
                                    name="avatar.mouth"
                                    property={mouth.default}
                                />
                            </div>
                        </div>
                        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                            <p>Accessory:</p>
                            <div className="col-span-3">
                                <SelectProperty
                                    form={form}
                                    name="avatar.accessories"
                                    property={accessories.default}
                                />
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
