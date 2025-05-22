import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router';
import api from '../utils/api/axios';
import { Container, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
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

    const logUser = async (data) => {
        setLoading(true);
        setError('');
        
        try {
            const res = await api.post('/login', data);
            
            // Debug: Log the entire response to see the structure
            console.log('Full API Response:', res);
            console.log('Response Data:', res.data);
            
            if (res.status === 200) {
                // Check for different possible token property names
                const token = res.data.AccessToken || 
                             res.data.accessToken || 
                             res.data.access_token || 
                             res.data.jwtToken ||
                             res.data.authToken;
                
                if (token) {
                    login(token);
                    console.log('Login successful');
                    navigate("/home");
                } else {
                    console.error('No token found in response:', res.data);
                    setError('Login failed. No authentication token received.');
                }
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            console.error('Error response:', err.response);
            
            if (err.response?.status === 400) {
                setError('Invalid email or password.');
            } else if (err.response?.status === 401) {
                setError('Unauthorized. Please check your credentials.');
            } else if (err.response?.data?.message) {
                // Use server error message if available
                setError(err.response.data.message);
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        logUser({ email, password });
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
                    Login From Here
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Log In'}
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </Container>
    );
}