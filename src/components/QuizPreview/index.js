import React, { useState } from 'react';

function QuizPreview({ open, onClose, children }) {
    return (
        <>
            {open && (
                <div className="absolute left-0 top-0 z-50 h-screen w-screen bg-indigo-950">
                    SLIDE PREVIEW
                </div>
            )}
        </>
    );
}

export default QuizPreview;
