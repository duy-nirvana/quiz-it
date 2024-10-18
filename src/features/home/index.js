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
        <div className="flex flex-grow flex-col justify-center">
            <div className="flex flex-col items-center justify-center gap-6 -translate-y-1/4">
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
        </div>
    );
}

export default Home;
