// const axiosInstance = axios.create({
//     baseURL: 'https://api.example.com', // Replace with your API base URL
//     // timeout: 10000, // Set a default timeout for requests (optional)
//     headers: {
//         'Content-Type': 'application/json',
//         // Add any default headers if necessary, e.g., Authorization tokens
//     },
// });

export function setupAxios(axios) {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.defaults.headers = { 'Content-Type': 'application/json' };

    axios.interceptors.request.use(
        (config) => {
            // Modify request config (e.g., add auth token to headers)
            const token = localStorage.getItem('access_token'); // Example: getting token from localStorage
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
            // Handle response errors globally
            if (error.response && error.response.status === 401) {
                // Handle unauthorized errors, for example, by redirecting to login
            }
            return Promise.reject(error);
        }
    );
}
