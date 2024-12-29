import axios from "axios";

export const imgurApi = {
    get: (imgPath) => axios({
        method: 'get',
        baseURL: process.env.REACT_APP_IMGUR_API_URL,
        url: `/image/${imgPath}`,
    }),
    upload: (formData) => axios({
        method: "post",
        baseURL: process.env.REACT_APP_IMGUR_API_URL,
        url: `/image`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
};
