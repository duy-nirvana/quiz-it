import axios from 'axios';

const ENDPOINT = 'personal';

export const personalApi = {
    personal: () => axios.get(ENDPOINT),
};
