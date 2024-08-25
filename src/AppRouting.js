import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/home'));

function AppRouting(props) {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default AppRouting;
