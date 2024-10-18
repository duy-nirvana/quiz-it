import { Input } from '@mantine/core';
import React from 'react';

function List(props) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="lg:col-span-2 lg:col-start-2">
                <Input placeholder="Search" size="lg" />
                <div className="my-3 flex flex-col gap-2">
                    <div className="flex h-32 min-h-32 rounded bg-slate-200 px-3 py-2">
                        <img
                            src="https://placehold.co/300x200/EEE/31343C"
                            className="object-fit h-full w-44"
                        />
                        <div>
                            <p>Title123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default List;
