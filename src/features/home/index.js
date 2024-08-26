import { Button, Center, Input } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home(props) {
    const navigate = useNavigate();

    return (
        <>
            <header className="fixed top-0 px-4 py-6 bg-transparent w-full">
                <div className="flex justify-end">
                    <Button
                        variant="filled"
                        color="teal"
                        size="md"
                        onClick={() => navigate('/quiz')}
                    >
                        Create
                    </Button>
                    <Button variant="subtle" color="white" size="md">
                        Login
                    </Button>
                </div>
            </header>
            <div className="h-screen bg-indigo-950 flex flex-col justify-center items-center gap-6">
                <p className="text-8xl text-white font-black text-center">
                    QUIZ IT
                </p>
                <div className="w-6 min-w-fit text-center gap-2 flex flex-col bg-indigo-800 p-6 rounded-xl">
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
