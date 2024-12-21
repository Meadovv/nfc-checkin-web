import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Logout() {

    const { logout } = useAuth();
    React.useEffect(() => {
        logout();
    }, []);
}