import { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';

function loadStoredAuth() {
    try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            return { user: JSON.parse(storedUser), token: storedToken };
        }
    } catch {
        // Corrupted localStorage contents — fall through to a logged-out state.
    }
    return { user: null, token: null };
}

export const AuthProvider = ({ children }) => {
    const [{ user, token }, setAuth] = useState(loadStoredAuth);

    const login = useCallback((userData, authToken) => {
        setAuth({ user: userData, token: authToken });
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    }, []);

    const logout = useCallback(() => {
        setAuth({ user: null, token: null });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }, []);

    // fetch wrapper that attaches the Bearer token to every request and logs
    // the user out automatically when the server rejects it (expired/invalid).
    const authFetch = useCallback((url, options = {}) => {
        const headers = { ...(options.headers || {}) };
        if (token) headers.Authorization = `Bearer ${token}`;
        return fetch(url, { ...options, headers }).then((res) => {
            if (res.status === 401) logout();
            return res;
        });
    }, [token, logout]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, authFetch, loading: false }}>
            {children}
        </AuthContext.Provider>
    );
};
