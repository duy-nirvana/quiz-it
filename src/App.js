import logo from './logo.svg';
import './App.css';
import { Suspense } from 'react';
import AppRouting from './AppRouting';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
    fontFamily: 'Lexend, sans-serif',
    fontFamilyMonospace: 'Lexend, Courier, monospace',
    fontSmoothing: true,
    headings: { fontFamily: 'Lexend, Greycliff CF, sans-serif' },
});

function App() {
    return (
        <MantineProvider theme={theme}>
            <Notifications />
            <div className="App">
                <Suspense
                    fallback={
                        <div className="h-screen place-content-center bg-transparent"></div>
                    }
                >
                    <AppRouting />
                </Suspense>
            </div>
        </MantineProvider>
    );
}

export default App;
