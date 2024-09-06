import logo from './logo.svg';
import './App.css';
import { Suspense } from 'react';
import AppRouting from './AppRouting';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

const theme = createTheme({
    fontFamily: 'Lexend, sans-serif',
    fontFamilyMonospace: 'Lexend, Courier, monospace',
    headings: { fontFamily: 'Lexend, Greycliff CF, sans-serif' },
});

function App() {
    return (
        <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
                <MantineProvider theme={theme}>
                    <AppRouting />
                </MantineProvider>
            </Suspense>
        </div>
    );
}

export default App;
