import { API_BASE_URL } from "../config";

// utils/auth.js
const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
    } catch (error) {
        // If refresh fails, log out the user
        localStorage.clear();
        window.location.href = '/';
        throw error;
    }
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        // If token is expired
        if (response.status === 401) {
            // Try to get a new access token
            accessToken = await refreshAccessToken();

            // Retry the original request with new token
            const retryResponse = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            return retryResponse;
        }

        return response;
    } catch (error) {
        throw error;
    }
};
