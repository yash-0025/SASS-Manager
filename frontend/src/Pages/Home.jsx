
import React, { useEffect, useState } from 'react';
import UserLayout from '../Layouts/UserLayout';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, CircularProgress } from '@mui/material';
import api from '../utils/api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get('/api/services');
            setServices(response.data || []);
        } catch (err) {
            console.error('Error fetching services:', err);
            setError('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleServiceAction = (serviceId) => {
        if (!isLogin) {
            navigate('/login');
            return;
        }
        // Add service to cart or handle service selection
        console.log('Service selected:', serviceId);
        // You can implement add to cart functionality here
    };

    return (
        <UserLayout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box textAlign="center" mb={4}>
                    <Typography variant="h2" component="h1" gutterBottom>
                        Welcome to SAAS Manager
                    </Typography>
                    <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>
                        Manage your software services efficiently
                    </Typography>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box textAlign="center">
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
                            Available Services
                        </Typography>
                        <Grid container spacing={3}>
                            {services.length > 0 ? (
                                services.map((service) => (
                                    <Grid item xs={12} sm={6} md={4} key={service.id || service._id}>
                                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography gutterBottom variant="h5" component="h3">
                                                    {service.servicename || service.title || 'Service'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {service.description || 'No description available'}
                                                </Typography>
                                                {service.price && (
                                                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                                        ${service.price}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                            <CardActions>
                                                <Button 
                                                    size="small" 
                                                    variant="contained" 
                                                    color="primary"
                                                    onClick={() => handleServiceAction(service.id || service._id)}
                                                >
                                                    {isLogin ? 'Add to Cart' : 'Login to Purchase'}
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Box textAlign="center" py={4}>
                                        <Typography variant="h6" color="textSecondary">
                                            No services available at the moment
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </>
                )}

                {!isLogin && (
                    <Box textAlign="center" mt={4} p={3} bgcolor="background.paper" borderRadius={2}>
                        <Typography variant="h6" gutterBottom>
                            Get Started Today!
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            Sign up to access all our services and manage your subscriptions
                        </Typography>
                        <Box mt={2}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{ mr: 2 }}
                                onClick={() => navigate('/signup')}
                            >
                                Sign Up
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Button>
                        </Box>
                    </Box>
                )}
            </Container>
        </UserLayout>
    );
}

export default Home;