
import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router';
import LocalMallSharpIcon from '@mui/icons-material/LocalMallSharp';
import { Link, CircularProgress } from '@mui/material';
import logo from '../images/logo.svg'
import { useAuth } from '../context/AuthContext';

const UserLayout = ({ children }) => {
    const { isLogin, isAdmin, isSuperAdmin, name, logout, loading } = useAuth();
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
        navigate('/home');
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleCloseUserMenu();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <AppBar position="sticky">
                <Container maxWidth="xl">
                    <Toolbar>
                        <img src={logo} alt="Logo" height={50} width={50} />
                        <Typography
                            variant="h6"
                            component="a"
                            href="/home"
                            sx={{
                                mr: 0,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            SAAS
                        </Typography>

                        <Typography
                            variant="h5"
                            component="a"
                            href="/home"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            SAAS
                        </Typography>
                        
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex' }, px: 3 }}>
                            <MenuItem sx={{ px: 4 }}>
                                <Link 
                                    href="/home" 
                                    textAlign="center" 
                                    sx={{ 
                                        color: (theme) => theme.palette.secondary['main'],
                                        textDecoration: 'none'
                                    }}
                                >
                                    Home
                                </Link>
                            </MenuItem>
                        </Box>

                        {isLogin ? (
                            <>
                                <Box sx={{ flexGrow: 0.02, px: 1 }}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu}>
                                            <Avatar sx={{ backgroundColor: (theme) => theme.palette.common['grey'] }}>
                                                {name ? name.charAt(0).toUpperCase() : 'U'}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {name && (
                                            <MenuItem disabled>
                                                <Typography textAlign="center" variant="body2" color="textSecondary">
                                                    Welcome, {name}
                                                </Typography>
                                            </MenuItem>
                                        )}

                                        {isAdmin && (
                                            <>
                                                <MenuItem onClick={() => handleNavigation('/dashboard/users')}>
                                                    <Typography textAlign="center">
                                                        Dashboard Users
                                                    </Typography>
                                                </MenuItem>

                                                {isSuperAdmin && (
                                                    <MenuItem onClick={() => handleNavigation('/dashboard/services')}>
                                                        <Typography textAlign="center">
                                                            Dashboard Services
                                                        </Typography>
                                                    </MenuItem>
                                                )}
                                            </>
                                        )}

                                        <MenuItem onClick={handleLogout}>
                                            <Typography textAlign="center" color="error">
                                                Log out
                                            </Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                                
                                <IconButton 
                                    color='inherit' 
                                    sx={{ backgroundColor: (theme) => theme.palette.common['grey'] }} 
                                    onClick={() => navigate('/cart')}
                                >
                                    <LocalMallSharpIcon sx={{ fontSize: 25 }} />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => navigate('/signup')}
                                    variant="text"
                                    sx={{
                                        mr: 1,
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                    }}
                                >
                                    SignUp
                                </Button>
                                <Button
                                    onClick={() => navigate('/login')}
                                    variant="text"
                                    sx={{
                                        mr: 0,
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                    }}
                                >
                                    LogIn
                                </Button>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            {children}
        </>
    );
};

export default UserLayout;