import { Button } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SlidePreview from '../../../components/SlidePreview';

function Edit(props) {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-indigo-950 py-4 flex flex-col gap-4">
            <Button
                className="self-start"
                onClick={() => navigate('/')}
            >{`<- back`}</Button>
            <div className="flex gap-2 h-full">
                <div className="bg-slate-300 h-full rounded-lg min-w-52 p-2">
                    {Array(3)
                        .fill(null)
                        .map((item) => (
                            <SlidePreview className={'mb-4 last:mb-0'} />
                        ))}
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