import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import {
    Notifications,
    notifications,
    showNotification,
} from '@mantine/notifications';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import AppRouting from './AppRouting';
import { showToast } from 'helpers';
import { GoogleOAuthProvider } from '@react-oauth/google';

const theme = createTheme({
    fontFamily: 'Lexend, sans-serif',
    fontFamilyMonospace: 'Lexend, Courier, monospace',
    fontSmoothing: true,
    headings: { fontFamily: 'Lexend, Greycliff CF, sans-serif' },
    background: 'blue'
});

function App() {
    function ErrorFallback({ error, resetErrorBoundary }) {
        // Display error as a toast notification
        // showNotification({
        //     title: 'An error occurred',
        //     message: error.message,
        //     color: 'red',
        // });

        return (
            <div role="alert">
                <p>Something went wrong:</p>
                <pre>{error.message}</pre>
                <Button onClick={resetErrorBoundary}>Try again</Button>
            </div>
        );
    }

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error) => {
                // Log or perform additional actions on error
                console.error(error);
            }}
        >
            <GoogleOAuthProvider
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`}
            >
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
            </GoogleOAuthProvider>
        </ErrorBoundary>
    );
}

export default App;
