// import React, { useEffect, useState } from 'react';
// import DashboardLayout from '../Layouts/DashboardLayout';
// import {
//     Container,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Button,
//     Box,
//     CircularProgress,
//     Alert,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     IconButton,
//     Chip,
//     Grid,
//     Card,
//     CardContent,
//     CardActions,
//     MenuItem,
//     Select,
//     FormControl,
//     InputLabel,
//     Tooltip
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import ViewListIcon from '@mui/icons-material/ViewList';
// import ViewModuleIcon from '@mui/icons-material/ViewModule';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import api from '../utils/api/axios';
// import { useAuth } from '../context/AuthContext';

// function DashboardServices() {
//     const [services, setServices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [openDialog, setOpenDialog] = useState(false);
//     const [openViewDialog, setOpenViewDialog] = useState(false);
//     const [editingService, setEditingService] = useState(null);
//     const [viewingService, setViewingService] = useState(null);
//     const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
//     const [formData, setFormData] = useState({
//         servicename: '',
//         description: '',
//         price: 0,
//         category: '',
//         status: 'active',
//         features: '',
//         duration: 'Monthly',
//         maxUsers: 0,
//         plan: 'basic' // Added required plan field
//     });
//     const [formErrors, setFormErrors] = useState({});
//     const { isSuperAdmin } = useAuth();

//     const serviceCategories = [
//         'Email Services',
//         'Cloud Storage',
//         'Web Tools',
//         'Analytics',
//         'Security',
//         'Communication',
//         'Productivity',
//         'Development Tools',
//         'Marketing',
//         'Other'
//     ];

//     const statusOptions = [
//         { value: 'active', label: 'Active', color: 'success' },
//         { value: 'inactive', label: 'Inactive', color: 'default' },
//         { value: 'maintenance', label: 'Maintenance', color: 'warning' },
//         { value: 'deprecated', label: 'Deprecated', color: 'error' }
//     ];

//     // Added plan options
//     const planOptions = [
//         { value: 'Basic', label: 'Basic' },
//         { value: 'Standard', label: 'Standard' },
//         { value: 'Elite', label: 'Elite' }
//     ];

//     useEffect(() => {
//         fetchServices();
//     }, []);

//     const fetchServices = async () => {
//         setLoading(true);
//         try {
//             const token = sessionStorage.getItem('access-token');
//             const response = await api.get('/api/services', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setServices(response.data || []);
//             setError('');
//         } catch (err) {
//             console.error('Error fetching services:', err);
//             setError('Failed to load services. Using demo data.');
//             // Mock data for demonstration
//             setServices([
//                 {
//                     _id: 1,
//                     servicename: 'Premium Email Service',
//                     name: 'Premium Email Service', // For display compatibility
//                     description: 'Professional email hosting with 100GB storage, advanced spam protection, and 24/7 support.',
//                     price: 9.99,
//                     category: 'Email Services',
//                     status: 'active',
//                     features: 'Advanced spam protection, 100GB storage, 24/7 support, Mobile app',
//                     duration: 'Monthly',
//                     maxUsers: 50,
//                     plan: 'standard',
//                     createdAt: new Date().toISOString(),
//                     updatedAt: new Date().toISOString()
//                 },
//                 {
//                     _id: 2,
//                     servicename: 'Cloud Storage Pro',
//                     name: 'Cloud Storage Pro', // For display compatibility
//                     description: 'Secure cloud storage with 1TB space, file sharing, and collaboration tools.',
//                     price: 19.99,
//                     category: 'Cloud Storage',
//                     status: 'active',
//                     features: '1TB storage, File sharing, Collaboration tools, Version control',
//                     duration: 'Monthly',
//                     maxUsers: 100,
//                     plan: 'premium',
//                     createdAt: new Date().toISOString(),
//                     updatedAt: new Date().toISOString()
//                 },
//                 {
//                     _id: 3,
//                     servicename: 'Website Builder',
//                     name: 'Website Builder', // For display compatibility
//                     description: 'Easy drag-and-drop website builder with templates and hosting.',
//                     price: 14.99,
//                     category: 'Web Tools',
//                     status: 'maintenance',
//                     features: 'Drag-and-drop editor, 100+ templates, Free hosting, SSL certificate',
//                     duration: 'Monthly',
//                     maxUsers: 1,
//                     plan: 'standard',
//                     createdAt: new Date().toISOString(),
//                     updatedAt: new Date().toISOString()
//                 },
//                 {
//                     _id: 4,
//                     servicename: 'Analytics Dashboard',
//                     name: 'Analytics Dashboard', // For display compatibility
//                     description: 'Comprehensive analytics dashboard with real-time reporting.',
//                     price: 29.99,
//                     category: 'Analytics',
//                     status: 'inactive',
//                     features: 'Real-time reporting, Custom dashboards, Data export, API access',
//                     duration: 'Monthly',
//                     maxUsers: 25,
//                     plan: 'enterprise',
//                     createdAt: new Date().toISOString(),
//                     updatedAt: new Date().toISOString()
//                 }
//             ]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const validateForm = () => {
//         const errors = {};

//         if (!formData.servicename.trim()) {
//             errors.servicename = 'Service name is required';
//         }

//         if (!formData.description.trim()) {
//             errors.description = 'Description is required';
//         }

//         if (!formData.price || parseFloat(formData.price) <= 0) {
//             errors.price = 'Price must be greater than 0';
//         }

//         if (!formData.category) {
//             errors.category = 'Category is required';
//         }

//         if (!formData.plan) {
//             errors.plan = 'Plan is required';
//         }

//         setFormErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleOpenDialog = (service = null) => {
//         if (service) {
//             console.log(service)
//             setEditingService(service);
//             setFormData({
//                 servicename: service.servicename || service.name || '',
//                 description: service.description || '',
//                 price: service.price || 0,
//                 category: service.category || '',
//                 status: service.status || 'active',
//                 features: service.features || '',
//                 duration: service.duration || 'Monthly',
//                 maxUsers: service.maxUsers || 0,
//                 plan: service.plan || 'Basic' // Added plan field
//             });
//         } else {
//             setEditingService(null);
//             setFormData({
//                 servicename: '',
//                 description: '',
//                 price: 0,
//                 category: '',
//                 status: 'active',
//                 features: '',
//                 duration: 'Monthly',
//                 maxUsers: 0,
//                 plan: 'Basic' // Added default plan
//             });
//         }
//         setFormErrors({});
//         setOpenDialog(true);
//     };

//     const handleOpenViewDialog = (service) => {
//         setViewingService(service);
//         setOpenViewDialog(true);
//     };

//     const handleCloseDialog = () => {
//         setOpenDialog(false);
//         setEditingService(null);
//         setFormData({
//             servicename: '',
//             description: '',
//             price: 0,
//             category: '',
//             status: 'active',
//             features: '',
//             duration: 'Monthly',
//             maxUsers: 0,
//             plan: 'basic' // Reset plan field
//         });
//         setFormErrors({});
//     };

//     const handleCloseViewDialog = () => {
//         setOpenViewDialog(false);
//         setViewingService(null);
//     };

//     const handleInputChange = (event) => {
//         const { name, value, type } = event.target;

//         // Convert number fields properly
//         const processedValue = type === 'number'
//             ? (value === '' ? 0 : Number(value))
//             : value;

//         setFormData(prev => ({
//             ...prev,
//             [name]: processedValue
//         }));

//         if (formErrors[name]) {
//             setFormErrors(prev => ({
//                 ...prev,
//                 [name]: ''
//             }));
//         }
//     };

//     const handleSubmit = async () => {
//     console.log("Button Clicked");
//     console.log("Form Data:", formData);

//     if (!validateForm()) {
//         console.log("Validation failed:", formErrors);
//         return;
//     }

//     try {
//         const token = sessionStorage.getItem('access-token');
//         const headers = {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         };

//         // Ensure all required Stripe fields are included
//         const submitData = {
//             ...formData,
//             price: parseFloat(formData.price) || 0,
//             maxUsers: parseInt(formData.maxUsers) || 0,
//             // Add any additional fields required by your backend for Stripe
//             name: formData.servicename, // Stripe requires a 'name' field
//             type: 'service' // Example additional field
//         };

//         console.log("Submit Data:", submitData);


//         if (editingService) {
//             // Use the ID from the editingService object
//             const serviceId = editingService._id || editingService.id;
//             console.log("Service Id",serviceId)
//             if (!serviceId) {
//                 throw new Error("No service ID found for update");
//             }

//             const response = await api.patch(
//                 `/api/updateservice/${serviceId}`,
//                 submitData,
//                 { headers }
//             );
//             console.log("Update response:", response);
//         } else {
//             const response = await api.post(
//                 '/api/addservice',
//                 submitData,
//                 { headers }
//             );
//             console.log("Create response:", response);
//         }

//         await fetchServices();
//         handleCloseDialog();
//         alert(editingService ? 'Service updated successfully!' : 'Service created successfully!');

//     } catch (err) {
//         console.error('Error saving service:', err);
//         console.error('Error details:', err.response?.data);
//         alert(`Failed to save service: ${err.response?.data?.message || err.message}`);
//     }
// };

//     const handleDeleteService = async (serviceId) => {
//         if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
//             return;
//         }

//         try {
//             const token = sessionStorage.getItem('access-token');
//             await api.delete(`/api/deleteservice/${serviceId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             await fetchServices();
//             alert('Service deleted successfully!');
//         } catch (err) {
//             console.error('Error deleting service:', err);
//             alert(`Failed to delete service: ${err.response?.data?.message || err.message}`);
//         }
//     };

//     const getStatusColor = (status) => {
//         const statusOption = statusOptions.find(option => option.value === status);
//         return statusOption ? statusOption.color : 'default';
//     };

//     const getStatusLabel = (status) => {
//         const statusOption = statusOptions.find(option => option.value === status);
//         return statusOption ? statusOption.label : status?.toUpperCase() || 'UNKNOWN';
//     };

//     const getPlanLabel = (plan) => {
//         const planOption = planOptions.find(option => option.value === plan);
//         return planOption ? planOption.label : plan?.toUpperCase() || 'BASIC';
//     };

//     const renderTableView = () => (
//         <TableContainer component={Paper}>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Name</TableCell>
//                         <TableCell>Description</TableCell>
//                         <TableCell>Price</TableCell>
//                         <TableCell>Category</TableCell>
//                         <TableCell>Plan</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>Max Users</TableCell>
//                         <TableCell>Created Date</TableCell>
//                         <TableCell align="center">Actions</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {services.map((service) => (
//                         <TableRow key={service._id}>

//                             <TableCell>
//                                 <Typography variant="subtitle1" fontWeight="medium">
//                                     {service.servicename || service.name || 'N/A'}
//                                 </Typography>
//                             </TableCell>
//                             <TableCell>
//                                 <Typography variant="body2" color="textSecondary">
//                                     {service.description
//                                         ? (service.description.length > 50
//                                             ? `${service.description.substring(0, 50)}...`
//                                             : service.description)
//                                         : 'No description'
//                                     }
//                                 </Typography>
//                             </TableCell>
//                             <TableCell>
//                                 <Typography variant="body2" fontWeight="medium" color="primary">
//                                     ${service.price || 0}/{service.duration?.toLowerCase() || 'month'}
//                                 </Typography>
//                             </TableCell>
//                             <TableCell>
//                                 <Chip
//                                     label={service.category || 'Uncategorized'}
//                                     size="small"
//                                     variant="outlined"
//                                 />
//                             </TableCell>
//                             <TableCell>
//                                 <Chip
//                                     label={getPlanLabel(service.plan)}
//                                     size="small"
//                                     variant="filled"
//                                     color="info"
//                                 />
//                             </TableCell>
//                             <TableCell>
//                                 <Chip
//                                     label={getStatusLabel(service.status)}
//                                     color={getStatusColor(service.status)}
//                                     size="small"
//                                 />
//                             </TableCell>
//                             <TableCell>{service.maxUsers || 'Unlimited'}</TableCell>
//                             <TableCell>
//                                 {service.createdAt ?
//                                     new Date(service.createdAt).toLocaleDateString() :
//                                     'N/A'
//                                 }
//                             </TableCell>
//                             <TableCell align="center">
//                                 <Tooltip title="View Details">
//                                     <IconButton
//                                         color="info"
//                                         onClick={() => handleOpenViewDialog(service)}
//                                         size="small"
//                                     >
//                                         <VisibilityIcon />
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title="Edit Service">
//                                     <IconButton
//                                         color="primary"
//                                         onClick={() => handleOpenDialog(service)}
//                                         size="small"
//                                     >
//                                         <EditIcon />
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title="Delete Service">
//                                     <IconButton
//                                         color="error"
//                                         onClick={() => handleDeleteService(service._id)}
//                                         size="small"
//                                     >
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 </Tooltip>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );

//     const renderCardView = () => (
//         <Grid container spacing={3}>
//             {services.map((service) => (
//                 <Grid item xs={12} sm={6} md={4} key={service._id}>
//                     <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//                         <CardContent sx={{ flexGrow: 1 }}>
//                             <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
//                                 <Typography variant="h6" component="h3" noWrap>
//                                     {service.servicename || service.name}
//                                 </Typography>
//                                 <Chip
//                                     label={getStatusLabel(service.status)}
//                                     color={getStatusColor(service.status)}
//                                     size="small"
//                                 />
//                             </Box>

//                             <Typography variant="body2" color="textSecondary" paragraph>
//                                 {service.description}
//                             </Typography>

//                             <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                                 <Typography variant="h6" color="primary">
//                                     ${service.price}
//                                 </Typography>
//                                 <Typography variant="body2" color="textSecondary">
//                                     /{service.duration?.toLowerCase() || 'month'}
//                                 </Typography>
//                             </Box>

//                             <Box display="flex" gap={1} mb={1}>
//                                 <Chip
//                                     label={service.category}
//                                     size="small"
//                                     variant="outlined"
//                                 />
//                                 <Chip
//                                     label={getPlanLabel(service.plan)}
//                                     size="small"
//                                     variant="filled"
//                                     color="info"
//                                 />
//                             </Box>

//                             <Typography variant="body2" color="textSecondary">
//                                 Max Users: {service.maxUsers || 'Unlimited'}
//                             </Typography>
//                         </CardContent>

//                         <CardActions>
//                             <Button
//                                 size="small"
//                                 onClick={() => handleOpenViewDialog(service)}
//                                 startIcon={<VisibilityIcon />}
//                             >
//                                 View
//                             </Button>
//                             <Button
//                                 size="small"
//                                 onClick={() => handleOpenDialog(service)}
//                                 startIcon={<EditIcon />}
//                             >
//                                 Edit
//                             </Button>
//                             <Button
//                                 size="small"
//                                 color="error"
//                                 onClick={() => handleDeleteService(service._id)}
//                                 startIcon={<DeleteIcon />}
//                             >
//                                 Delete
//                             </Button>
//                         </CardActions>
//                     </Card>
//                 </Grid>
//             ))}
//         </Grid>
//     );

//     if (!isSuperAdmin) {
//         return (
//             <DashboardLayout>
//                 <Alert severity="error">
//                     Access denied. Only Super Admins can manage services.
//                 </Alert>
//             </DashboardLayout>
//         );
//     }

//     return (
//         <DashboardLayout>
//             <Container maxWidth="lg">
//                 <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
//                     <Typography variant="h4" component="h1">
//                         Service Management
//                     </Typography>
//                     <Box display="flex" gap={2}>
//                         <Box display="flex" alignItems="center">
//                             <IconButton
//                                 color={viewMode === 'table' ? 'primary' : 'default'}
//                                 onClick={() => setViewMode('table')}
//                             >
//                                 <ViewListIcon />
//                             </IconButton>
//                             <IconButton
//                                 color={viewMode === 'card' ? 'primary' : 'default'}
//                                 onClick={() => setViewMode('card')}
//                             >
//                                 <ViewModuleIcon />
//                             </IconButton>
//                         </Box>
//                         <Button
//                             variant="contained"
//                             startIcon={<AddIcon />}
//                             onClick={() => handleOpenDialog()}
//                         >
//                             Add New Service
//                         </Button>
//                     </Box>
//                 </Box>

//                 {loading ? (
//                     <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//                         <CircularProgress />
//                     </Box>
//                 ) : error ? (
//                     <Alert severity="warning" sx={{ mb: 2 }}>
//                         {error}
//                     </Alert>
//                 ) : services.length === 0 ? (
//                     <Box textAlign="center" py={8}>
//                         <Typography variant="h6" color="textSecondary" gutterBottom>
//                             No services found
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary" gutterBottom>
//                             Create your first service to get started
//                         </Typography>
//                         <Button
//                             variant="contained"
//                             startIcon={<AddIcon />}
//                             onClick={() => handleOpenDialog()}
//                             sx={{ mt: 2 }}
//                         >
//                             Add First Service
//                         </Button>
//                     </Box>
//                 ) : (
//                     viewMode === 'table' ? renderTableView() : renderCardView()
//                 )}

//                 {/* Add/Edit Service Dialog */}
//                 <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
//                     <DialogTitle>
//                         {editingService ? 'Edit Service' : 'Add New Service'}
//                     </DialogTitle>
//                     <DialogContent>
//                         <Grid container spacing={2} sx={{ mt: 1 }}>
//                             <Grid item xs={12} sm={6}>
//                                 <TextField
//                                     required
//                                     fullWidth
//                                     label="Service Name"
//                                     name="servicename"
//                                     value={formData.servicename}
//                                     onChange={handleInputChange}
//                                     error={!!formErrors.servicename}
//                                     helperText={formErrors.servicename}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={6}>
//                                 <FormControl fullWidth required error={!!formErrors.category}>
//                                     <InputLabel>Category</InputLabel>
//                                     <Select
//                                         name="category"
//                                         value={formData.category}
//                                         onChange={handleInputChange}
//                                         label="Category"
//                                     >
//                                         {serviceCategories.map((category) => (
//                                             <MenuItem key={category} value={category}>
//                                                 {category}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <TextField
//                                     required
//                                     fullWidth
//                                     multiline
//                                     rows={3}
//                                     label="Description"
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                     error={!!formErrors.description}
//                                     helperText={formErrors.description}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={3}>
//                                 <TextField
//                                     required
//                                     fullWidth
//                                     label="Price"
//                                     name="price"
//                                     type="number"
//                                     step="0.01"
//                                     value={formData.price}
//                                     onChange={handleInputChange}
//                                     error={!!formErrors.price}
//                                     helperText={formErrors.price}
//                                     InputProps={{
//                                         startAdornment: '$'
//                                     }}
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={3}>
//                                 <FormControl fullWidth>
//                                     <InputLabel>Duration</InputLabel>
//                                     <Select
//                                         name="duration"
//                                         value={formData.duration}
//                                         onChange={handleInputChange}
//                                         label="Duration"
//                                     >
//                                         <MenuItem value="Monthly">Monthly</MenuItem>
//                                         <MenuItem value="Yearly">Yearly</MenuItem>
//                                         <MenuItem value="One-time">One-time</MenuItem>
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item xs={12} sm={3}>
//                                 <TextField
//                                     fullWidth
//                                     label="Max Users"
//                                     name="maxUsers"
//                                     type="number"
//                                     value={formData.maxUsers}
//                                     onChange={handleInputChange}
//                                     helperText="Leave empty for unlimited"
//                                 />
//                             </Grid>
//                             <Grid item xs={12} sm={3}>
//                                 <FormControl fullWidth required error={!!formErrors.plan}>
//                                     <InputLabel>Plan</InputLabel>
//                                     <Select
//                                         name="plan"
//                                         value={formData.plan}
//                                         onChange={handleInputChange}
//                                         label="Plan"
//                                     >
//                                         {planOptions.map((option) => (
//                                             <MenuItem key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <TextField
//                                     fullWidth
//                                     label="Features"
//                                     name="features"
//                                     value={formData.features}
//                                     onChange={handleInputChange}
//                                     helperText="Separate features with commas"
//                                     multiline
//                                     rows={2}
//                                 />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <FormControl fullWidth>
//                                     <InputLabel>Status</InputLabel>
//                                     <Select
//                                         name="status"
//                                         value={formData.status}
//                                         onChange={handleInputChange}
//                                         label="Status"
//                                     >
//                                         {statusOptions.map((option) => (
//                                             <MenuItem key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                         </Grid>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleCloseDialog}>Cancel</Button>
//                         <Button onClick={handleSubmit} variant="contained">
//                             {editingService ? 'Update Service' : 'Create Service'}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>

//                 {/* View Service Dialog */}
//                 <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
//                     <DialogTitle>Service Details</DialogTitle>
//                     <DialogContent>
//                         {viewingService && (
//                             <Box sx={{ pt: 2 }}>
//                                 <Typography variant="h6" gutterBottom>
//                                     {viewingService.servicename || viewingService.name}
//                                 </Typography>

//                                 <Box display="flex" gap={1} mb={2}>
//                                     <Chip
//                                         label={viewingService.category}
//                                         variant="outlined"
//                                         size="small"
//                                     />
//                                     <Chip
//                                         label={getPlanLabel(viewingService.plan)}
//                                         variant="filled"
//                                         color="info"
//                                         size="small"
//                                     />
//                                     <Chip
//                                         label={getStatusLabel(viewingService.status)}
//                                         color={getStatusColor(viewingService.status)}
//                                         size="small"
//                                     />
//                                 </Box>

//                                 <Typography variant="body1" paragraph>
//                                     {viewingService.description}
//                                 </Typography>

//                                 <Grid container spacing={2}>
//                                     <Grid item xs={6}>
//                                         <Typography variant="subtitle2" color="textSecondary">
//                                             Price
//                                         </Typography>
//                                         <Typography variant="h6" color="primary">
//                                             ${viewingService.price}/{viewingService.duration?.toLowerCase() || 'month'}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={6}>
//                                         <Typography variant="subtitle2" color="textSecondary">
//                                             Max Users
//                                         </Typography>
//                                         <Typography variant="body1">
//                                             {viewingService.maxUsers || 'Unlimited'}
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>

//                                 {viewingService.features && (
//                                     <Box mt={2}>
//                                         <Typography variant="subtitle2" color="textSecondary" gutterBottom>
//                                             Features
//                                         </Typography>
//                                         <Typography variant="body2">
//                                             {viewingService.features}
//                                         </Typography>
//                                     </Box>
//                                 )}

//                                 <Box mt={2}>
//                                     <Typography variant="subtitle2" color="textSecondary">
//                                         Created Date
//                                     </Typography>
//                                     <Typography variant="body2">
//                                         {viewingService.createdAt ?
//                                             new Date(viewingService.createdAt).toLocaleString() :
//                                             'N/A'
//                                         }
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         )}
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleCloseViewDialog}>Close</Button>
//                         <Button
//                             onClick={() => {
//                                 handleCloseViewDialog();
//                                 handleOpenDialog(viewingService);
//                             }}
//                             variant="contained"
//                         >
//                             Edit Service
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Container>
//         </DashboardLayout>
//     );
// }

// export default DashboardServices;





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
    IconButton,
    Chip,
    Grid,
    Card,
    CardContent,
    CardActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../utils/api/axios';
import { useAuth } from '../context/AuthContext';

function DashboardServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [viewingService, setViewingService] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [formData, setFormData] = useState({
        servicename: '',
        description: '',
        price: 0,
        features: '',
        duration: 'Monthly',
        plan: 'basic'
    });
    const [formErrors, setFormErrors] = useState({});
    const { isSuperAdmin } = useAuth();

    // Added plan options
    const planOptions = [
        { value: 'Basic', label: 'Basic' },
        { value: 'Standard', label: 'Standard' },
        { value: 'Elite', label: 'Elite' }
    ];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('access-token');
            const response = await api.get('/api/services', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setServices(response.data || []);
            setError('');
        } catch (err) {
            console.error('Error fetching services:', err);
            setError('Failed to load services. Using demo data.');
            // Mock data for demonstration
            setServices([
                {
                    _id: 1,
                    servicename: 'Premium Email Service',
                    name: 'Premium Email Service',
                    description: 'Professional email hosting with 100GB storage, advanced spam protection, and 24/7 support.',
                    price: 9.99,
                    features: 'Advanced spam protection, 100GB storage, 24/7 support, Mobile app',
                    duration: 'Monthly',
                    plan: 'standard',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: 2,
                    servicename: 'Cloud Storage Pro',
                    name: 'Cloud Storage Pro',
                    description: 'Secure cloud storage with 1TB space, file sharing, and collaboration tools.',
                    price: 19.99,
                    features: '1TB storage, File sharing, Collaboration tools, Version control',
                    duration: 'Monthly',
                    plan: 'premium',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: 3,
                    servicename: 'Website Builder',
                    name: 'Website Builder',
                    description: 'Easy drag-and-drop website builder with templates and hosting.',
                    price: 14.99,
                    features: 'Drag-and-drop editor, 100+ templates, Free hosting, SSL certificate',
                    duration: 'Monthly',
                    plan: 'standard',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    _id: 4,
                    servicename: 'Analytics Dashboard',
                    name: 'Analytics Dashboard',
                    description: 'Comprehensive analytics dashboard with real-time reporting.',
                    price: 29.99,
                    features: 'Real-time reporting, Custom dashboards, Data export, API access',
                    duration: 'Monthly',
                    plan: 'enterprise',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.servicename.trim()) {
            errors.servicename = 'Service name is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            errors.price = 'Price must be greater than 0';
        }

        if (!formData.plan) {
            errors.plan = 'Plan is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleOpenDialog = (service = null) => {
        if (service) {
            console.log(service)
            setEditingService(service);
            setFormData({
                servicename: service.servicename || service.name || '',
                description: service.description || '',
                price: service.price || 0,
                features: service.features || '',
                duration: service.duration || 'Monthly',
                plan: service.plan || 'Basic'
            });
        } else {
            setEditingService(null);
            setFormData({
                servicename: '',
                description: '',
                price: 0,
                features: '',
                duration: 'Monthly',
                plan: 'Basic'
            });
        }
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleOpenViewDialog = (service) => {
        setViewingService(service);
        setOpenViewDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingService(null);
        setFormData({
            servicename: '',
            description: '',
            price: 0,
            features: '',
            duration: 'Monthly',
            plan: 'basic'
        });
        setFormErrors({});
    };

    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
        setViewingService(null);
    };

    const handleInputChange = (event) => {
        const { name, value, type } = event.target;

        const processedValue = type === 'number'
            ? (value === '' ? 0 : Number(value))
            : value;

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async () => {
        console.log("Button Clicked");
        console.log("Form Data:", formData);

        if (!validateForm()) {
            console.log("Validation failed:", formErrors);
            return;
        }

        try {
            const token = sessionStorage.getItem('access-token');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const submitData = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                name: formData.servicename,
                type: 'service'
            };

            console.log("Submit Data:", submitData);

            if (editingService) {
                const serviceId = editingService._id || editingService.id;
                console.log("Service Id", serviceId)
                if (!serviceId) {
                    throw new Error("No service ID found for update");
                }

                const response = await api.patch(
                    `/api/updateservice/${serviceId}`,
                    submitData,
                    { headers }
                );
                console.log("Update response:", response);
            } else {
                const response = await api.post(
                    '/api/addservice',
                    submitData,
                    { headers }
                );
                console.log("Create response:", response);
            }

            await fetchServices();
            handleCloseDialog();
            alert(editingService ? 'Service updated successfully!' : 'Service created successfully!');

        } catch (err) {
            console.error('Error saving service:', err);
            console.error('Error details:', err.response?.data);
            alert(`Failed to save service: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
            return;
        }

        try {
            const token = sessionStorage.getItem('access-token');
            await api.delete(`/api/deleteservice/${serviceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await fetchServices();
            alert('Service deleted successfully!');
        } catch (err) {
            console.error('Error deleting service:', err);
            alert(`Failed to delete service: ${err.response?.data?.message || err.message}`);
        }
    };

    const getPlanLabel = (plan) => {
        const planOption = planOptions.find(option => option.value === plan);
        return planOption ? planOption.label : plan?.toUpperCase() || 'BASIC';
    };

    const renderTableView = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Plan</TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {services.map((service) => (
                        <TableRow key={service._id}>
                            <TableCell>
                                <Typography variant="subtitle1" fontWeight="medium">
                                    {service.servicename || service.name || 'N/A'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="textSecondary">
                                    {service.description
                                        ? (service.description.length > 50
                                            ? `${service.description.substring(0, 50)}...`
                                            : service.description)
                                        : 'No description'
                                    }
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight="medium" color="primary">
                                    ${service.price || 0}/{service.duration?.toLowerCase() || 'month'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={getPlanLabel(service.plan)}
                                    size="small"
                                    variant="filled"
                                    color="info"
                                />
                            </TableCell>
                            <TableCell>
                                {service.createdAt ?
                                    new Date(service.createdAt).toLocaleDateString() :
                                    'N/A'
                                }
                            </TableCell>
                            <TableCell align="center">
                                <Tooltip title="View Details">
                                    <IconButton
                                        color="info"
                                        onClick={() => handleOpenViewDialog(service)}
                                        size="small"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Service">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(service)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Service">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteService(service._id)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderCardView = () => (
        <Grid container spacing={3}>
            {services.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <Typography variant="h6" component="h3" noWrap>
                                    {service.servicename || service.name}
                                </Typography>
                            </Box>

                            <Typography variant="body2" color="textSecondary" paragraph>
                                {service.description}
                            </Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6" color="primary">
                                    ${service.price}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    /{service.duration?.toLowerCase() || 'month'}
                                </Typography>
                            </Box>

                            <Box display="flex" gap={1} mb={1}>
                                <Chip
                                    label={getPlanLabel(service.plan)}
                                    size="small"
                                    variant="filled"
                                    color="info"
                                />
                            </Box>
                        </CardContent>

                        <CardActions>
                            <Button
                                size="small"
                                onClick={() => handleOpenViewDialog(service)}
                                startIcon={<VisibilityIcon />}
                            >
                                View
                            </Button>
                            <Button
                                size="small"
                                onClick={() => handleOpenDialog(service)}
                                startIcon={<EditIcon />}
                            >
                                Edit
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                onClick={() => handleDeleteService(service._id)}
                                startIcon={<DeleteIcon />}
                            >
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    if (!isSuperAdmin) {
        return (
            <DashboardLayout>
                <Alert severity="error">
                    Access denied. Only Super Admins can manage services.
                </Alert>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" component="h1">
                        Service Management
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Box display="flex" alignItems="center">
                            <IconButton
                                color={viewMode === 'table' ? 'primary' : 'default'}
                                onClick={() => setViewMode('table')}
                            >
                                <ViewListIcon />
                            </IconButton>
                            <IconButton
                                color={viewMode === 'card' ? 'primary' : 'default'}
                                onClick={() => setViewMode('card')}
                            >
                                <ViewModuleIcon />
                            </IconButton>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add New Service
                        </Button>
                    </Box>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                ) : services.length === 0 ? (
                    <Box textAlign="center" py={8}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            No services found
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Create your first service to get started
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ mt: 2 }}
                        >
                            Add First Service
                        </Button>
                    </Box>
                ) : (
                    viewMode === 'table' ? renderTableView() : renderCardView()
                )}

                {/* Add/Edit Service Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {editingService ? 'Edit Service' : 'Add New Service'}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Service Name"
                                    name="servicename"
                                    value={formData.servicename}
                                    onChange={handleInputChange}
                                    error={!!formErrors.servicename}
                                    helperText={formErrors.servicename}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    error={!!formErrors.description}
                                    helperText={formErrors.description}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    error={!!formErrors.price}
                                    helperText={formErrors.price}
                                    InputProps={{
                                        startAdornment: '$'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Duration</InputLabel>
                                    <Select
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        label="Duration"
                                    >
                                        <MenuItem value="Monthly">Monthly</MenuItem>
                                        <MenuItem value="Yearly">Yearly</MenuItem>
                                        <MenuItem value="One-time">One-time</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth required error={!!formErrors.plan}>
                                    <InputLabel>Plan</InputLabel>
                                    <Select
                                        name="plan"
                                        value={formData.plan}
                                        onChange={handleInputChange}
                                        label="Plan"
                                    >
                                        {planOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Features"
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    helperText="Separate features with commas"
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            {editingService ? 'Update Service' : 'Create Service'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* View Service Dialog */}
                <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Service Details</DialogTitle>
                    <DialogContent>
                        {viewingService && (
                            <Box sx={{ pt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    {viewingService.servicename || viewingService.name}
                                </Typography>

                                <Box display="flex" gap={1} mb={2}>
                                    <Chip
                                        label={getPlanLabel(viewingService.plan)}
                                        variant="filled"
                                        color="info"
                                        size="small"
                                    />
                                </Box>

                                <Typography variant="body1" paragraph>
                                    {viewingService.description}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Price
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            ${viewingService.price}/{viewingService.duration?.toLowerCase() || 'month'}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {viewingService.features && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Features
                                        </Typography>
                                        <Typography variant="body2">
                                            {viewingService.features}
                                        </Typography>
                                    </Box>
                                )}

                                <Box mt={2}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Created Date
                                    </Typography>
                                    <Typography variant="body2">
                                        {viewingService.createdAt ?
                                            new Date(viewingService.createdAt).toLocaleString() :
                                            'N/A'
                                        }
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseViewDialog}>Close</Button>
                        <Button
                            onClick={() => {
                                handleCloseViewDialog();
                                handleOpenDialog(viewingService);
                            }}
                            variant="contained"
                        >
                            Edit Service
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </DashboardLayout>
    );
}

export default DashboardServices;