

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Container, Card, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api/axios';
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
    const navigate = useNavigate();
    const { login, isLogin } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    // Redirect if already logged in
    React.useEffect(() => {
        if (isLogin) {
            navigate('/home');
        }
    }, [isLogin, navigate]);

    const addUser = async (data) => {
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/signup', data);
            
            if (res.status === 200 || res.status === 201) {
                // Check if response contains token (adjust based on your API response)
                const token = res.data.jwtToken || res.data.AccessToken || res.data.token;
                
                if (token) {
                    login(token);
                    console.log('Sign up successful');
                    navigate("/home");
                } else {
                    setError('Signup successful but no token received. Please login.');
                    navigate("/login");
                }
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            if (err.response?.status === 400) {
                setError('User already exists or invalid data provided.');
            } else if (err.response?.status === 409) {
                setError('Email already registered. Please use a different email.');
            } else {
                setError('Signup failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('Name');
        const email = data.get('email');
        const password = data.get('password');

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        addUser({ 
            name, 
            email, 
            password, 
            isadmin: false, 
            issuperadmin: false 
        });
    };

    return (
        <Container component="main" maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2,
                    p: 4,
                    minWidth: 400,
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: (theme) => theme.palette.primary['main'] }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Signup From Here
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="Name"
                                required
                                fullWidth
                                id="Name"
                                label="Full Name"
                                autoFocus
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                type="email"
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </Container>
    );
}