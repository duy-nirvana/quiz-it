import { Anchor, Badge, Button, Checkbox, Input } from '@mantine/core';
import { IconLockPassword, IconUser } from '@tabler/icons-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen min-h-fit flex-col gap-4 bg-indigo-950 p-2">
            <Badge
                radius="sm"
                variant="gradient"
                gradient={{ from: 'cyan', to: 'violet', deg: 130 }}
                className="min-h-fit cursor-pointer px-3 py-2 text-2xl"
                onClick={() => navigate('/')}
            >
                <p className="font-bold">QUIZ IT</p>
            </Badge>
            <div className="flex flex-grow items-center justify-center">
                <div className="flex h-fit w-96 flex-col items-stretch gap-6 rounded-lg bg-slate-600/50 p-6">
                    <p className="text-xl font-semibold text-white">Welcome!</p>
                    <div className="flex flex-col gap-3">
                        <Input
                            placeholder="Username"
                            label="username"
                            size="lg"
                            className="font-semibold"
                            leftSection={
                                <IconUser className="h-5 w-5 stroke-[2.5px]" />
                            }
                        />
                        <Input
                            placeholder="Password"
                            size="lg"
                            className="font-semibold"
                            type="password"
                            leftSection={
                                <IconLockPassword className="h-5 w-5 stroke-[2.5px]" />
                            }
                        />
                        <Checkbox
                            label="Remember me"
                            size="xs"
                            classNames={{
                                body: 'flex items-center',
                                label: '!text-sm text-white',
                            }}
                        />
                    </div>
                    <Button
                        size="lg"
                        variant="gradient"
                        gradient={{ from: 'cyan', to: 'violet', deg: 130 }}
                    >
                        Sign in
                    </Button>

                    <div className="flex flex-col items-center justify-center gap-2">
                        <Anchor
                            href="/"
                            target="_blank"
                            underline="hover"
                            className="text-sm"
                        >
                            Forgot password?
                        </Anchor>
                        <p className="text-sm text-white">
                            Don't have an account?{' '}
                            <Anchor
                                href="/"
                                target="_blank"
                                underline="hover"
                                className="text-sm"
                            >
                                Sign up
                            </Anchor>
                        </p>
                        <div className="flex w-full items-center gap-2">
                            <div className="h-[1px] flex-grow bg-slate-400"></div>
                            <p className="h-fit text-sm text-white">or</p>
                            <div className="h-[1px] flex-grow bg-slate-400"></div>
                        </div>
                        <Button
                            variant="white"
                            size="md"
                            leftSection={
                                <img
                                    src="/icon/google-color-icon.svg"
                                    className="h-6 w-6"
                                />
                            }
                            justify="center"
                            fullWidth
                        >
                            <p className="text-slate-700">
                                Sign in with Google
                            </p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
