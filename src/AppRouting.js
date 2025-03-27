// import ResultFeature from 'features/result';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const MainLayout = React.lazy(() => import('./layout/MainLayout'));

const Auth = React.lazy(() => import('./features/auth'));
const Home = React.lazy(() => import('./features/home'));
const QuizFeature = React.lazy(() => import('./features/quiz'));
const ProfileFeature = React.lazy(() => import('./features/profile'));
const HostLiveFeature = React.lazy(() => import('./features/host'));
const ParticipantPlayingFeature = React.lazy(() => import('./features/play'));
const ResultFeature = React.lazy(() => import('./features/result'));

function AppRouting(props) {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="profile/*" element={<ProfileFeature />} />
                <Route path="result/:id" element={<ResultFeature />} />
            </Route>
            <Route path="auth/*" element={<Auth />} />
            <Route path="quiz/*" element={<QuizFeature />} />
            <Route path="host/:id" element={<HostLiveFeature />} />
            <Route path="play/:id" element={<ParticipantPlayingFeature />} />
        </Routes>
    );
}

export default AppRouting;
