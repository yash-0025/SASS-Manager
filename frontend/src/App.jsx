

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import DashboardUsers from './Pages/DashboardUsers';
import DashboardServices from './Pages/DashboardServices';
import Cart from './Pages/Cart';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    common: {
      grey: '#f5f5f5',
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard/users" element={<DashboardUsers />} />
            <Route path="/dashboard/services" element={<DashboardServices />} />
            <Route path="/cart" element={<Cart />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;