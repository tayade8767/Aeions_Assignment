/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/user/validate-token', {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                sessionStorage.clear();
            }
        };

        if (token) {
            validateToken();
        }
    }, [token]);

    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;