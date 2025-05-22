import React, { useEffect, useState } from 'react';
import DashboardLayout from '../Layouts/DashboardLayout';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Checkbox,
    IconButton,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '../utils/api/axios';
import { useAuth } from '../context/AuthContext';

function DashboardUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        isadmin: false,
        issuperadmin: false
    });
    const { isAdmin, isSuperAdmin } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = sessionStorage.getItem('access-token');
            const response = await api.get('/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users');
            // Mock data for demonstration
            setUsers([
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    isadmin: false,
                    issuperadmin: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    isadmin: true,
                    issuperadmin: false,
                    createdAt: new Date().toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                isadmin: user.isadmin || false,
                issuperadmin: user.issuperadmin || false
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                isadmin: false,
                issuperadmin: false
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            isadmin: false,
            issuperadmin: false
        });
    };

    const handleInputChange = (event) => {
        const { name, value, checked, type } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = sessionStorage.getItem('access-token');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            if (editingUser) {
                // Update user
                const updateData = { ...formData };
                if (!updateData.password) {
                    delete updateData.password; // Don't update password if empty
                }
                
                await api.put(`/users/${editingUser.id}`, updateData, { headers });
            } else {
                // Create new user
                await api.post('/users', formData, { headers });
            }

            fetchUsers();
            handleCloseDialog();
        } catch (err) {
            console.error('Error saving user:', err);
            alert('Failed to save user. Please try again.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const token = sessionStorage.getItem('access-token');
            await api.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user. Please try again.');
        }
    };

    const getUserRole = (user) => {
        if (user.issuperadmin) return 'Super Admin';
        if (user.isadmin) return 'Admin';
        return 'User';
    };

    const getRoleColor = (user) => {
        if (user.issuperadmin) return 'error';
        if (user.isadmin) return 'warning';
        return 'default';
    };

    if (!isAdmin && !isSuperAdmin) {
        return (
            <DashboardLayout>
                <Alert severity="error">
                    Access denied. You don't have permission to view this page.
                </Alert>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" component="h1">
                        User Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add New User
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Created Date</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id || user._id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={getUserRole(user)} 
                                                color={getRoleColor(user)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {user.createdAt ? 
                                                new Date(user.createdAt).toLocaleDateString() : 
                                                'N/A'
                                            }
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog(user)}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteUser(user.id || user._id)}
                                                size="small"
                                                disabled={user.issuperadmin && !isSuperAdmin}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Add/Edit User Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingUser ? 'Edit User' : 'Add New User'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label={editingUser ? "New Password (leave blank to keep current)" : "Password"}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required={!editingUser}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isadmin}
                                    onChange={handleInputChange}
                                    name="isadmin"
                                />
                            }
                            label="Admin"
                        />
                        {isSuperAdmin && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.issuperadmin}
                                        onChange={handleInputChange}
                                        name="issuperadmin"
                                    />
                                }
                                label="Super Admin"
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            {editingUser ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </DashboardLayout>
    );
}

export default DashboardUsers;