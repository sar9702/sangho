import { axiosBaseInstance, axiosAuthInstance } from '../axiosInstance';
import { setTokens, removeTokens } from '../utils/storage';

export const login = async (credentials: { username: string; password: string }) => {
    const response = await axiosBaseInstance.post('/auth/login/', credentials);
    setTokens(response.data.access_token, response.data.refresh_token);
};

export const logout = async () => {
    await axiosAuthInstance.post('/auth/logout/', {});
    removeTokens();
};

export const register = async (credentials: { username: string; password: string }) => {
    const response = await axiosBaseInstance.post('/auth/register/', credentials);
    return response.data;
};

export const checkUsername = async (credentials: { username: string }) => {
    const response = await axiosBaseInstance.get('/auth/check-username/', {
        params: { username: credentials.username },
    });
    console.log(response.data);

    return response.data;
};
