import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from './utils/storage';
import type { AxiosRequestHeaders } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';
const TIMEOUT = 10000;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: TIMEOUT,
});

interface TokenResponse {
    access_token: string;
    refresh_token: string;
}

interface ErrorResponse {
    detail?: string;
}

const addAuthHeaderInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
        (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    }
    return config;
};

const refreshToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        handleTokenFailure();
        throw new Error('No refresh token available');
    }

    try {
        const { data } = await axios.post<TokenResponse>(
            `${API_BASE_URL}auth/refresh/`,
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } },
        );

        setTokens(data.access_token, data.refresh_token);
        return data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        handleTokenFailure();
        return Promise.reject(error);
    }
};

const handleTokenFailure = () => {
    removeTokens();
    window.location.href = '/';
};

const handleResponseError = async (error: AxiosError<ErrorResponse>) => {
    if (!error.response) return Promise.reject(error);

    const { status, data, config } = error.response;
    const originalRequest = config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 403 && data?.detail === '액세스 토큰이 만료되었습니다.' && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const newAccessToken = await refreshToken();
            (originalRequest.headers as AxiosRequestHeaders).Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    return Promise.reject(error);
};

const setupInterceptors = () => {
    axiosInstance.interceptors.request.use(addAuthHeaderInterceptor, (error) => Promise.reject(error));
    axiosInstance.interceptors.response.use((response) => response, handleResponseError);
};

setupInterceptors();

export { axiosInstance as axiosAuthInstance, axiosInstance as axiosBaseInstance };
