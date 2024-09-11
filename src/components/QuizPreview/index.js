import { ActionIcon, Button } from '@mantine/core';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

function QuizPreview({ open, onClose, children, className }) {
    return (
        <>
            {open && (
                <div
                    className={twMerge(
                        'absolute left-0 top-0 z-50 h-screen w-screen bg-indigo-950',
                        className
                    )}
                >
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                        <div className="flex gap-x-2 rounded-md bg-slate-600/20 px-4 py-2">
                            <Button
                                variant="subtle"
                                color="white"
                                rightSection={<IconX />}
                                onClick={onClose}
                            >
                                Exit preview
                            </Button>
                            <Button
                                variant="subtle"
                                color="white"
                                rightSection={<IconX />}
                                onClick={onClose}
                            >
                                Exit preview
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default QuizPreview;
