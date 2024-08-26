import logo from './logo.svg';
import './App.css';
import { Suspense } from 'react';
import AppRouting from './AppRouting';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

function App() {
    return (
        <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
                <MantineProvider>
                    <AppRouting />
                </MantineProvider>
            </Suspense>
        </div>
    );
}

export default App;
