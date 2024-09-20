import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Auth = React.lazy(() => import('./features/auth'));
const Home = React.lazy(() => import('./features/home'));
const QuizFeature = React.lazy(() => import('./features/quiz'));

function AppRouting(props) {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/*" element={<QuizFeature />} />
            <Route path="/auth/*" element={<Auth />} />
        </Routes>
    );
}

export default AppRouting;
