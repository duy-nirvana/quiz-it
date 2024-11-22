import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Edit = React.lazy(() => import('./pages/Edit'));

function QuizFeature(props) {
    return (
        <Routes>
            <Route index element={<Edit />} />
            <Route path="/:id" element={<Edit />} />
            <Route path="*" element={<>Error</>} />
        </Routes>
    );
}

export default QuizFeature;
