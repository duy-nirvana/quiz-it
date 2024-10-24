import axios from 'axios';

const ENDPOINT = 'topic';

export const topicApi = {
    getAll: (params) => axios.get(ENDPOINT, { params }),
};
