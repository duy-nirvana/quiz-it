import React from 'react';
import { Route, Routes } from 'react-router-dom';

const List = React.lazy(() => import('./pages/List'));

function Profile(props) {
    return (
        <Routes>
            <Route index element={<List />} />
            <Route path="*" element={<>Error</>} />
        </Routes>
    );
}

export default Profile;