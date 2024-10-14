import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Auth = React.lazy(() => import('./features/auth'));
const Home = React.lazy(() => import('./features/home'));
const QuizFeature = React.lazy(() => import('./features/quiz'));
const ProfileFeature = React.lazy(() => import('./features/profile'));
const MainLayout = React.lazy(() => import('./layout/MainLayout'));

function AppRouting(props) {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/quiz/*" element={<QuizFeature />} />
                <Route path="/auth/*" element={<Auth />} />
                <Route path="/profile/*" element={<ProfileFeature />} />
            </Route>
        </Routes>
    );
}

export default AppRouting;
