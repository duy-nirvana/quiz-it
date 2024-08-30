import { ActionIcon, Badge, Button, Divider, Input } from '@mantine/core';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SlidePreview from '../../../components/SlidePreview';
import { IconChevronLeft, IconPlus, IconEye } from '@tabler/icons-react';

function Edit(props) {
    const navigate = useNavigate();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    return (
        <div className="h-screen min-h-0 bg-indigo-950 p-2 flex flex-col gap-4 ">
            <div className="flex  justify-between">
                <div className="flex items-center gap-4">
                    <Badge
                        radius="sm"
                        variant="gradient"
                        gradient={{ from: 'cyan', to: 'violet', deg: 130 }}
                        className="h-fit px-3 py-2 cursor-pointer text-2xl"
                        onClick={() => navigate('/')}
                    >
                        <p className="font-bold ">QUIZ IT</p>
                    </Badge>
                    
                    <Input
                        size="md"
                        placeholder="Enter title"
                        className="w-96 font-bold"
                    />
                </div>
                <div className="flex gap-4">
                    <Button
                        size="md"
                        leftSection={<IconEye className="w-5 h-5" />}
                        color="cyan"
                    >
                        Preview
                    </Button>
                    <Divider orientation="vertical" color="gray" />
                    <div className="flex gap-2">
                        <Button size="md" variant="default">
                            Exit
                        </Button>
                        <Button size="md">Save</Button>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 flex-1 overflow-auto">
                <div className="bg-slate-300 rounded-lg min-w-52 flex flex-col overflow-hidden">
                    <div className="overflow-y-auto">
                        {Array(6)
                            .fill(null)
                            .map((item, index) => (
                                <SlidePreview
                                    className={'p-2 pr-4'}
                                    index={index}
                                    isActive={activeQuestionIndex === index}
                                    setActive={setActiveQuestionIndex}
                                    error
                                />
                            ))}
                    </div>
                    <div className="text-center bg-slate-300 py-4 ">
                        <Button
                            leftSection={
                                <IconPlus className="w-4 h-4 min-w-4" />
                            }
                        >
                            Add question
                        </Button>
                    </div>
                </div>

                <div className="bg-slate-400 h-full rounded-lg flex-auto">
                    COL 2
                </div>
                <div className="bg-slate-400 h-full rounded-lg min-w-96">
                    COL 3
                </div>
            </div>
        </div>
    );
}

export default Edit;
