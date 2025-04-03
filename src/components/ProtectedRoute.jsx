import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        // Redirect to login if no access token exists
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
