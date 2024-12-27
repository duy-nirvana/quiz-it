import axios from 'axios';

const ENDPOINT = 'quiz';

export const quizApi = {
    getAll: (params) => axios.get(ENDPOINT, { params }),
    getDetail: (id) => axios.get(ENDPOINT + '/' + id),
    create: (payload) => axios.post(ENDPOINT + '/create', payload),
};
