import axios from 'axios';

const ENDPOINT = 'session';

export const sessionApi = {
    getDetail: (id) => axios.get(ENDPOINT + '/' + id),
    create: (payload) => axios.post(ENDPOINT + '/create', payload),
    finish: (id) => axios.get(ENDPOINT + '/complete' + id),
};
