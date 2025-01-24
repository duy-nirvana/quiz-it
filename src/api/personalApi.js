import axios from 'axios';

const ENDPOINT = 'personal';

export const personalApi = {
    personal: (params) => axios.get(ENDPOINT, { params }),
};
