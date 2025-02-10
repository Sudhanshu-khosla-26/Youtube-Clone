import axios from 'axios';
import AuthService from './auth.service';

<<<<<<< HEAD
// const API_URL = "https://youtube-clone-gefz.onrender.com/api/v1";
const API_URL = "http://localhost:5000/api/v1";
=======
// const API_URL = import.meta.env.VITE_SERVER_URL 
const API_URL = "https://youtube-clone-gefz.onrender.com/api/v1";
>>>>>>> 2a76727fc1d8a24a5c91cee4c41ba199abd048d4

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthService.getAccessToken()}`,
        'Accept': 'application/json',
        
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
            const refToken = AuthService.getRefreshToken();
            if (!refToken || AuthService.isTokenExpired(refToken)) {
                throw new Error('Refresh token is invalid or expired');
            }

            // Call refresh token endpoint
            const response = await axios.post(`${API_URL}/users/refresh-token`, {
                refreshToken: refToken
            });
            
            const { accessToken, refreshToken } = response.data.data;

            // Update tokens in storage
            AuthService.updateTokens(accessToken, refreshToken);

            // Retry the original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (error) {
            // If refresh token fails, logout user
            AuthService.removeUser();
            window.location.href = '/v3/Signin';
            return Promise.reject(error);
        }
    }
);

export default api;
