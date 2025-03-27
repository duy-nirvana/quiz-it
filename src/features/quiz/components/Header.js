import {
    ActionIcon,
    Badge,
    Button,
    Divider,
    Popover,
    Tooltip,
} from '@mantine/core';
import { IconHistory, IconEye } from '@tabler/icons-react';
import InputField from 'components/form-controls/InputField';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Header({
    form,
    initialValues,
    disabled,
    onSubmit,
    isMobile,
    setActiveQuestionIndex,
    setOpenPreview,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [openedResetPopover, setOpenedResetPopover] = useState(false);

    return (
        <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
            <div className="flex items-center gap-4">
                <Badge
                    radius="sm"
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'violet', deg: 130 }}
                    className="h-fit cursor-pointer px-3 py-2 text-2xl"
                    onClick={() => navigate('/')}
                >
                    <p className="font-bold">QUIZ IT</p>
                </Badge>

                <InputField
                    form={form}
                    name="title"
                    size="md"
                    placeholder="Enter title"
                    className="min-w-60 grow font-bold lg:w-96"
                    showErrorText={false}
                />
            </div>
            <div className="flex justify-between gap-3">
                <div className="flex gap-2">
                    <Popover
                        width={250}
                        position="left"
                        withArrow
                        shadow="md"
                        opened={openedResetPopover}
                        onClick={() =>
                            setOpenedResetPopover(!openedResetPopover)
                        }
                    >
                        <Popover.Target>
                            {isMobile ? (
                                <ActionIcon
                                    size="md"
                                    variant="subtle"
                                    color="red"
                                >
                                    <IconHistory />
                                </ActionIcon>
                            ) : (
                                <Button
                                    size="md"
                                    show
                                    leftSection={
                                        <IconHistory className="h-5 w-5" />
                                    }
                                    color="red"
                                    variant="outline"
                                >
                                    Reset
                                </Button>
                            )}
                        </Popover.Target>
                        <Popover.Dropdown>
                            <div className="flex flex-col gap-2 text-center">
                                <p>It's will clear everything you changed</p>
                                <Button
                                    fullWidth
                                    color="red"
                                    onClick={() => {
                                        form.reset(initialValues);
                                        setActiveQuestionIndex(0);
                                        setOpenedResetPopover(false);
                                    }}
                                >
                                    OK
                                </Button>
                            </div>
                        </Popover.Dropdown>
                    </Popover>

                    {isMobile ? (
                        <ActionIcon
                            size="md"
                            color="cyan"
                            onClick={() => setOpenPreview(true)}
                        >
                            <IconEye />
                        </ActionIcon>
                    ) : (
                        <Button
                            size="md"
                            leftSection={<IconEye className="h-5 w-5" />}
                            color="cyan"
                            onClick={() => setOpenPreview(true)}
                        >
                            Preview
                        </Button>
                    )}
                </div>
                {!isMobile && (
                    <Divider orientation="vertical" color="gray" size="sm" />
                )}
                <div className="flex gap-2">
                    <Button
                        size={isMobile ? 'xs' : 'md'}
                        variant="default"
                        onClick={() => {
                            if (location?.state?.from) {
                                navigate(location?.state?.from, {
                                    state: location.state || {},
                                });
                            } else {
                                navigate('/');
                            }
                        }}
                    >
                        Exit
                    </Button>
                    <Tooltip
                        disabled={!disabled}
                        label="Only creator can save this quiz"
                    >
                        <Button
                            size={isMobile ? 'xs' : 'md'}
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={disabled}
                        >
                            Save
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

export default Header;
