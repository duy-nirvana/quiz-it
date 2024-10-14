import { Button, Center, Input, Menu } from '@mantine/core';
import {
    IconChevronDown,
    IconLogout2,
    IconUserCircle,
} from '@tabler/icons-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home(props) {
    const navigate = useNavigate();

    return (
        <>
            <header className="fixed top-0 w-full bg-transparent px-4 py-6">
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="filled"
                        color="teal"
                        size="md"
                        onClick={() => navigate('/quiz')}
                    >
                        Create
                    </Button>
                    {!true ? (
                        <Button
                            variant="subtle"
                            color="white"
                            size="md"
                            onClick={() => navigate('/auth/login')}
                        >
                            Login
                        </Button>
                    ) : (
                        <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                                <Button
                                    variant="subtle"
                                    color="white"
                                    size="md"
                                    rightSection={
                                        <IconChevronDown className="h-4 w-4" />
                                    }
                                >
                                    Hi, Dê Núi
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={
                                        <IconUserCircle className="h-5 w-5" />
                                    }
                                    onClick={() => navigate('/profile')}
                                >
                                    My profile
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                    leftSection={
                                        <IconLogout2 className="h-5 w-5" />
                                    }
                                >
                                    Log out
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )}
                </div>
            </header>
            <div className="flex h-screen flex-col items-center justify-center gap-6 bg-indigo-950">
                <p className="text-center text-8xl font-black text-white">
                    QUIZ IT
                </p>
                <div className="flex w-6 min-w-fit flex-col gap-2 rounded-xl bg-indigo-800 p-6 text-center">
                    <Input
                        placeholder="Game PIN"
                        size="lg"
                        classNames={{
                            input: '!text-center',
                        }}
                    />
                    <Button
                        variant="filled"
                        size="lg"
                        color="orange"
                        className="min-w-full"
                    >
                        GO
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Home;
