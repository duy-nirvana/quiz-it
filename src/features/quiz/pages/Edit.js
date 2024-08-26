import { Button } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Edit(props) {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-indigo-950 p-4 flex flex-col gap-4">
            <Button
                className="self-start"
                onClick={() => navigate('/')}
            >{`<- back`}</Button>
            <div className="grid grid-cols-8 grow gap-4">
                <div className="bg-slate-400 h-full rounded-lg col-span-1">
                    COL 1
                </div>
                <div className="bg-slate-400 h-full rounded-lg col-span-5">
                    COL 2
                </div>
                <div className="bg-slate-400 h-full rounded-lg col-span-2">
                    COL 3
                </div>
            </div>
        </div>
    );
}

export default Edit;
