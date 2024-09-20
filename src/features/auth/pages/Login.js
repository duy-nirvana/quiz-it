import { Badge, Button, Input } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-indigo-950 p-2">
            {/* <Badge
                radius="sm"
                variant="gradient"
                gradient={{ from: 'cyan', to: 'violet', deg: 130 }}
                className="h-fit cursor-pointer px-3 py-2 text-2xl"
                onClick={() => navigate('/')}
            >
                <p className="font-bold">QUIZ IT</p>
            </Badge> */}
            <div className="flex h-full items-center justify-center">
                <div className="flex h-fit w-96 flex-col items-stretch gap-6 rounded-lg bg-slate-600/50 px-6 py-4">
                    <p className="text-center text-xl font-semibold text-white">
                        Login
                    </p>
                    <div className="flex flex-col gap-3">
                        <Input
                            placeholder="Username"
                            label="username"
                            size="lg"
                            className="font-semibold"
                        />
                        <Input
                            placeholder="Password"
                            size="lg"
                            className="font-semibold"
                            type="password"
                        />
                    </div>
                    <Button size="lg">Login</Button>
                </div>
            </div>
        </div>
    );
}

export default Login;
