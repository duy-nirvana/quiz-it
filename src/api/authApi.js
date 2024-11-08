import axios from 'axios';

const ENDPOINT = 'auth';

export const authApi = {
    login: (payload) => axios.post(ENDPOINT + '/login', payload),
};
