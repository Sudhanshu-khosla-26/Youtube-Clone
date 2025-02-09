import { useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import api from '../services/api.service';

export const useAuth = () => {
    const [user, setUser] = useState(AuthService.getUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            try {
                if (!user) {
                    setLoading(false);
                    return;
                }

                if (AuthService.isTokenExpired(user.accessToken)) {
                    try {
                        // Try to refresh the token
                        const response = await api.post('/users/refresh-token', {
                            refreshToken: user.refreshToken
                        });
                        
                        const { accessToken, refreshToken } = response.data.data;
                        AuthService.updateTokens(accessToken, refreshToken);
                        setUser(AuthService.getUser());
                    } catch (error) {
                        // If refresh fails, log out
                        AuthService.removeUser();
                        setUser(null);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [user]);

    const login = async (credentials) => {
        const response = await api.post('/users/login', credentials);
        const userData = response.data.data;
        AuthService.setUser(userData);
        setUser(userData);
        return userData;
    };
    
    const logout = async () => {
        try {
            await api.post('/users/logout');
        } finally {
            AuthService.removeUser();
            setUser(null);
        }
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };
};

export default useAuth;
