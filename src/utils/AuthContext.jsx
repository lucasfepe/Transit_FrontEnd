// src/utils/AuthContext.jsx
import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const AuthContext = createContext({
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
    refresh: async () => { },
    makeAuthenticatedRequest: async () => { }
});

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
    const navigate = useNavigate();

    const authenticate = (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        setIsAuthenticated(true);
        navigate('/home');
    }

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            authenticate(data.accessToken);

        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            localStorage.clear();
            setIsAuthenticated(false);
            navigate('/');

        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const refresh = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                authenticate(data.accessToken);
            }

        } catch (error) {

            throw error;
        }
    };

    const makeAuthenticatedRequest = async (url, options = {}) => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.status === 401) {
                // Try to refresh the token
                accessToken = await refresh();

                // Retry the original request with new token
                return await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        isAuthenticated,
        login,
        logout,
        refresh,
        makeAuthenticatedRequest
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// For use in components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext };
