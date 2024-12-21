import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import robots from '../../utils/robots';

export default function Middleware({ needAuthenticate, children }) {

    const { isAuthenticated } = useAuth();

    if (needAuthenticate) {
        return isAuthenticated ? children : <Navigate to={robots.login} />
    } else {
        return isAuthenticated ? <Navigate to={robots.home} /> : children;
    }
}