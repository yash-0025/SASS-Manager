
import { Container, Box, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import UserLayout from './UserLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function DashboardLayout({ children }) {
    const navigate = useNavigate();
    const { isLogin, isAdmin, isSuperAdmin, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!isLogin) {
                navigate('/login');
            } else if (!isAdmin && !isSuperAdmin) {
                navigate('/home');
            }
        }
    }, [isLogin, isAdmin, isSuperAdmin, loading, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!isLogin || (!isAdmin && !isSuperAdmin)) {
        return null; // Will redirect in useEffect
    }

    return (
        <UserLayout>
            <Container component="main" sx={{ pt: 4, pb: 3 }}>
                {children}
            </Container>
        </UserLayout>
    );
}

export default DashboardLayout;