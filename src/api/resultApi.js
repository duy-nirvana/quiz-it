import axios from 'axios';

const ENDPOINT = 'result';

export const resultApi = {
    getDetail: (id) => axios.get(ENDPOINT + '/' + id),
    create: (payload) => axios.post(ENDPOINT + '/create', payload),
};
