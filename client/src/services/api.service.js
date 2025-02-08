import axios from 'axios';
import AuthService from './auth.service';

const API_URL = 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = AuthService.getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request has already been retried
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const refreshToken = AuthService.getRefreshToken();
            if (!refreshToken || AuthService.isTokenExpired(refreshToken)) {
                throw new Error('Refresh token is invalid or expired');
            }

            // Call refresh token endpoint
            const response = await axios.post(`${API_URL}/users/refresh-token`, {
                refreshToken
            });

            const { accessToken, newRefreshToken } = response.data.data;
            
            // Update tokens in storage
            AuthService.updateTokens(accessToken, newRefreshToken);
            
            // Retry the original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (error) {
            // If refresh token fails, logout user
            AuthService.removeUser();
            window.location.href = '/login';
            return Promise.reject(error);
        }
    }
);

export default api;
