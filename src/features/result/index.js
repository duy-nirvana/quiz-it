import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Detail = React.lazy(() => import('./pages/Detail'));

function ResultFeature(props) {
    return (
        <Routes>
            <Route index element={<Detail />} />
        </Routes>
    );
}

export default ResultFeature;
