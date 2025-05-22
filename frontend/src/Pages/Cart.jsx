
import React, { useEffect, useState } from 'react';
import UserLayout from '../Layouts/UserLayout';
import { 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    Box, 
    CircularProgress,
    IconButton,
    Divider,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api/axios';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const { isLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            navigate('/login');
            return;
        }
        fetchCartItems();
    }, [isLogin, navigate]);

    const fetchCartItems = async () => {
        try {
            const token = sessionStorage.getItem('access-token');
            const response = await api.get('/api/cart', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCartItems(response.data.items || []);
            calculateTotal(response.data.items || []);
        } catch (err) {
            console.error('Error fetching cart items:', err);
            setError('Failed to load cart items');
            // If cart endpoint doesn't exist, use empty cart
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (items) => {
        const totalAmount = items.reduce((sum, item) => {
            return sum + (item.price * (item.quantity || 1));
        }, 0);
        setTotal(totalAmount);
    };

    const removeFromCart = async (itemId) => {
        try {
            const token = sessionStorage.getItem('access-token');
            await api.delete(`/api/removeitem/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);
            calculateTotal(updatedItems);
        } catch (err) {
            console.error('Error removing item from cart:', err);
            // For demo purposes, remove from local state
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);
            calculateTotal(updatedItems);
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        
        try {
            const token = sessionStorage.getItem('access-token');
            const response = await api.post('/checkout', {
                items: cartItems
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Clear cart after successful checkout
            setCartItems([]);
            setTotal(0);
            alert('Checkout successful!');
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Checkout failed. Please try again.');
        }
    };

    if (!isLogin) {
        return null;
    }

    return (
        <UserLayout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={4}>
                    <ShoppingCartIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h3" component="h1">
                        Shopping Cart
                    </Typography>
                </Box>

                {loading ? (
                    <>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                ) : cartItems.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" color="textSecondary" gutterBottom>
                            Your cart is empty
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            Add some services to get started
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => navigate('/home')}
                            sx={{ mt: 2 }}
                        >
                            Browse Services
                        </Button>
                    </Box>
                    </>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                {cartItems.map((item) => (
                                    <Card key={item.id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="h6" component="h3">
                                                        {item.name || item.title || 'Service'}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {item.description || 'No description available'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Typography variant="body1">
                                                        Quantity: {item.quantity || 1}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} sm={2}>
                                                    <Typography variant="h6" color="primary">
                                                        ${item.price || 0}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={1}>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <Card sx={{ position: 'sticky', top: 20 }}>
                                    <CardContent>
                                        <Typography variant="h5" component="h2" gutterBottom>
                                            Order Summary
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="body1">
                                                Subtotal ({cartItems.length} items):
                                            </Typography>
                                            <Typography variant="body1">
                                                ${total.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="body1">
                                                Tax:
                                            </Typography>
                                            <Typography variant="body1">
                                                ${(total * 0.1).toFixed(2)}
                                            </Typography>
                                        </Box>
                                        
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                            <Typography variant="h6">
                                                Total:
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                ${(total * 1.1).toFixed(2)}
                                            </Typography>
                                        </Box>
                                        
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            fullWidth
                                            size="large"
                                            onClick={handleCheckout}
                                            disabled={cartItems.length === 0}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Container>
        </UserLayout>
    );
}

export default Cart;



// import React, { useEffect, useState } from 'react';
// import UserLayout from '../Layouts/UserLayout';
// import { 
//     Container, 
//     Typography, 
//     Grid, 
//     Card, 
//     CardContent, 
//     CardActions, 
//     Button, 
//     Box, 
//     CircularProgress,
//     IconButton,
//     Divider,
//     Alert,
//     TextField
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/api/axios';

// function Cart() {
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [total, setTotal] = useState(0);
//     const [checkoutLoading, setCheckoutLoading] = useState(false);
//     const { isLogin, user } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!isLogin) {
//             navigate('/login');
//             return;
//         }
//         fetchCartItems();
//     }, [isLogin, navigate]);

//     const fetchCartItems = async () => {
//         setLoading(true);
//         setError('');
//         try {
//             const token = sessionStorage.getItem('access-token');
//             const response = await api.get('/api/cart', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
            
//             console.log("Cart API Response:", response.data);
            
//             if (response.data?.success) {
//                 setCartItems(response.data.data || []);
//                 calculateTotal(response.data.data || []);
//             } else {
//                 setError(response.data?.message || 'Failed to load cart');
//             }
//         } catch (err) {
//             console.error('Error fetching cart items:', err);
//             setError(err.response?.data?.message || 
//                     err.response?.data?.error || 
//                     'Failed to load cart items. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const calculateTotal = (items) => {
//         const totalAmount = items.reduce((sum, item) => {
//             return sum + (item.service.price * (item.quantity || 1));
//         }, 0);
//         setTotal(totalAmount);
//     };

//     const updateQuantity = async (itemId, newQuantity) => {
//         if (newQuantity < 1) return;
        
//         try {
//             const updatedItems = cartItems.map(item => 
//                 item._id === itemId ? { ...item, quantity: newQuantity } : item
//             );
//             setCartItems(updatedItems);
//             calculateTotal(updatedItems);
//         } catch (err) {
//             console.error('Error updating quantity:', err);
//             setError('Failed to update quantity');
//         }
//     };

//     const removeFromCart = async (itemId) => {
//         try {
//             const token = sessionStorage.getItem('access-token');
//             await api.delete(`/api/removeitem/${itemId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
            
//             const updatedItems = cartItems.filter(item => item._id !== itemId);
//             setCartItems(updatedItems);
//             calculateTotal(updatedItems);
//         } catch (err) {
//             console.error('Error removing item from cart:', err);
//             setError(err.response?.data?.message || 'Failed to remove item');
//         }
//     };

//     const emptyCart = async () => {
//         try {
//             const token = sessionStorage.getItem('access-token');
//             await api.post('/api/emptycart', {}, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setCartItems([]);
//             setTotal(0);
//         } catch (err) {
//             console.error('Error emptying cart:', err);
//             setError(err.response?.data?.message || 'Failed to empty cart');
//         }
//     };

//     const handleCheckout = async () => {
//         setCheckoutLoading(true);
//         try {
//             // Implement your checkout logic here
//             alert('Checkout functionality would be implemented here');
//             await emptyCart();
//             navigate('/orders');
//         } catch (err) {
//             console.error('Checkout error:', err);
//             setError(err.response?.data?.message || 'Checkout failed. Please try again.');
//         } finally {
//             setCheckoutLoading(false);
//         }
//     };

//     if (!isLogin) {
//         return null;
//     }

//     return (
//         <UserLayout>
//             <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//                 <Box display="flex" alignItems="center" mb={4}>
//                     <ShoppingCartIcon sx={{ fontSize: 40, mr: 2 }} />
//                     <Typography variant="h3" component="h1">
//                         Shopping Cart
//                     </Typography>
//                 </Box>

//                 {loading ? (
//                     <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//                         <CircularProgress />
//                     </Box>
//                 ) : error ? (
//                     <Alert severity="error" sx={{ mb: 2 }}>
//                         {error}
//                     </Alert>
//                 ) : cartItems.length === 0 ? (
//                     <Box textAlign="center" py={8}>
//                         <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
//                         <Typography variant="h5" color="textSecondary" gutterBottom>
//                             Your cart is empty
//                         </Typography>
//                         <Typography variant="body1" color="textSecondary" gutterBottom>
//                             Add some services to get started
//                         </Typography>
//                         <Button 
//                             variant="contained" 
//                             color="primary" 
//                             onClick={() => navigate('/services')}
//                             sx={{ mt: 2 }}
//                         >
//                             Browse Services
//                         </Button>
//                     </Box>
//                 ) : (
//                     <>
//                         <Grid container spacing={3}>
//                             <Grid item xs={12} md={8}>
//                                 {cartItems.map((item) => (
//                                     <Card key={item._id} sx={{ mb: 2 }}>
//                                         <CardContent>
//                                             <Grid container spacing={2} alignItems="center">
//                                                 <Grid item xs={12} sm={5}>
//                                                     <Typography variant="h6" component="h3">
//                                                         {item.service?.servicename || 'Service'}
//                                                     </Typography>
//                                                     <Typography variant="body2" color="textSecondary">
//                                                         {item.service?.description || 'No description available'}
//                                                     </Typography>
//                                                     <Typography variant="body2">
//                                                         Plan: {item.service?.plan}
//                                                     </Typography>
//                                                 </Grid>
//                                                 <Grid item xs={4} sm={3}>
//                                                     <TextField
//                                                         type="number"
//                                                         value={item.quantity || 1}
//                                                         onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
//                                                         inputProps={{ min: 1 }}
//                                                         size="small"
//                                                         sx={{ width: 80 }}
//                                                     />
//                                                 </Grid>
//                                                 <Grid item xs={4} sm={2}>
//                                                     <Typography variant="h6" color="primary">
//                                                         ${(item.service?.price * (item.quantity || 1)).toFixed(2)}
//                                                         <Typography variant="caption" display="block">
//                                                             /{item.service?.duration?.toLowerCase()}
//                                                         </Typography>
//                                                     </Typography>
//                                                 </Grid>
//                                                 <Grid item xs={4} sm={2}>
//                                                     <IconButton 
//                                                         color="error" 
//                                                         onClick={() => removeFromCart(item._id)}
//                                                     >
//                                                         <DeleteIcon />
//                                                     </IconButton>
//                                                 </Grid>
//                                             </Grid>
//                                         </CardContent>
//                                     </Card>
//                                 ))}
//                                 <Box mt={2}>
//                                     <Button 
//                                         variant="outlined" 
//                                         color="error"
//                                         onClick={emptyCart}
//                                         startIcon={<DeleteIcon />}
//                                     >
//                                         Empty Cart
//                                     </Button>
//                                 </Box>
//                             </Grid>
                            
//                             <Grid item xs={12} md={4}>
//                                 <Card sx={{ position: 'sticky', top: 20 }}>
//                                     <CardContent>
//                                         <Typography variant="h5" component="h2" gutterBottom>
//                                             Order Summary
//                                         </Typography>
//                                         <Divider sx={{ my: 2 }} />
                                        
//                                         <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                                             <Typography variant="body1">
//                                                 Subtotal ({cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} items):
//                                             </Typography>
//                                             <Typography variant="body1">
//                                                 ${total.toFixed(2)}
//                                             </Typography>
//                                         </Box>
                                        
//                                         <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                                             <Typography variant="body1">
//                                                 Tax:
//                                             </Typography>
//                                             <Typography variant="body1">
//                                                 ${(total * 0.1).toFixed(2)}
//                                             </Typography>
//                                         </Box>
                                        
//                                         <Divider sx={{ my: 2 }} />
                                        
//                                         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//                                             <Typography variant="h6">
//                                                 Total:
//                                             </Typography>
//                                             <Typography variant="h6" color="primary">
//                                                 ${(total * 1.1).toFixed(2)}
//                                             </Typography>
//                                         </Box>
                                        
//                                         <Button 
//                                             variant="contained" 
//                                             color="primary" 
//                                             fullWidth
//                                             size="large"
//                                             onClick={handleCheckout}
//                                             disabled={checkoutLoading || cartItems.length === 0}
//                                         >
//                                             {checkoutLoading ? <CircularProgress size={24} /> : 'Proceed to Checkout'}
//                                         </Button>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         </Grid>
//                     </>
//                 )}
//             </Container>
//         </UserLayout>
//     );
// }

// export default Cart;