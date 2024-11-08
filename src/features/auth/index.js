import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));

function Auth(props) {
    return (
        <Routes>
            <Route index element={<Navigate to="login" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to={'/error/404'} replace />} />
        </Routes>
    );
}

export default Auth;
