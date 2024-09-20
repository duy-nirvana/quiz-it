import { Button, Center, Input } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home(props) {
    const navigate = useNavigate();

    return (
        <>
            <header className="fixed top-0 w-full bg-transparent px-4 py-6">
                <div className="flex justify-end">
                    <Button
                        variant="filled"
                        color="teal"
                        size="md"
                        onClick={() => navigate('/quiz')}
                    >
                        Create
                    </Button>
                    <Button
                        variant="subtle"
                        color="white"
                        size="md"
                        onClick={() => navigate('/auth/login')}
                    >
                        Login
                    </Button>
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
