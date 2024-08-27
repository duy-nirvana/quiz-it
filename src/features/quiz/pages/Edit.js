import { Button } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SlidePreview from '../../../components/SlidePreview';
import { IconChevronLeft, IconPlus } from '@tabler/icons-react';

function Edit(props) {
    const navigate = useNavigate();

    return (
        <div className="h-screen min-h-0 bg-indigo-950 py-4 flex flex-col gap-4 ">
            <div className="self-start ">
                <Button
                    onClick={() => navigate('/')}
                    leftSection={<IconChevronLeft size={14} />}
                >
                    Back
                </Button>
            </div>
            <div className="flex gap-2 flex-1 overflow-auto">
                <div className="bg-slate-300 rounded-lg min-w-52 p-2 pb-0 flex flex-col">
                    <div className="overflow-y-auto">
                        {Array(4)
                            .fill(null)
                            .map((item) => (
                                <SlidePreview className={'mb-4 last:mb-0'} />
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
