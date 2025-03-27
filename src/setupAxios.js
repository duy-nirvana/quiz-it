// const axiosInstance = axios.create({
//     baseURL: 'https://api.example.com', // Replace with your API base URL
//     // timeout: 10000, // Set a default timeout for requests (optional)
//     headers: {
//         'Content-Type': 'application/json',
//         // Add any default headers if necessary, e.g., Authorization tokens
//     },
// });

import { notifications, showNotification } from '@mantine/notifications';
import { showToast } from 'helpers';
import { clearAuthData } from 'store/auth/authSlice';
import { getCookie } from 'utils';

export function setupAxios(axios, store) {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.headers = { 'Content-Type': 'application/json' };

    axios.interceptors.request.use(
        (config) => {
            if (config.baseURL === process.env.REACT_APP_IMGUR_API_URL) {
                config.headers.Authorization = `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`;
                return config;
            }

            // Modify request config (e.g., add auth token to headers)
            const token = getCookie('access_token'); // Example: getting token from localStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
        (response) => response.data,
        (error) => {
            const response = error.response;
            switch (response.status) {
                // Handle unauthorized errors, for example, by redirecting to login
                case 401:
                    store.dispatch(clearAuthData());
                    window.location.href = '/auth/login';
                    break;
                default:
                    break;
            }
            return Promise.reject(error);
        }
    );
}
