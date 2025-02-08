
// const API_URL = 'http://localhost:8000/api/v1/users';

class AuthService {
    static getUser() {
        return JSON.parse(localStorage.getItem('USER'));
    }

    static setUser(user) {
        localStorage.setItem('USER', JSON.stringify(user));
    }

    static removeUser() {
        localStorage.removeItem('USER');
    }

    static getAccessToken() {
        const user = this.getUser();
        return user?.accessToken;
    }

    static getRefreshToken() {
        const user = this.getUser();
        return user?.refreshToken;
    }

    static updateTokens(accessToken, refreshToken) {
        const user = this.getUser();
        if (user) {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            this.setUser(user);
        }
    }

    static isTokenExpired(token) {
        if (!token) return true;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const { exp } = JSON.parse(jsonPayload);
            return exp * 1000 < Date.now();
        } catch (e) {
            return true;
        }
    }
}

export default AuthService;
