
// import './App.css'
// import { ThemeProvider, StyledEngineProvider, CssBaseline } from "@mui/material";
// import { BrowserRouter } from "react-router-dom";
// import Router from './Routes/routes';
// import theme from './utils/theme'

// function App() {


//   return (
//     <BrowserRouter>
//       <StyledEngineProvider injectFirst>
//       <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Router />
//       </ThemeProvider>
//       </StyledEngineProvider>
//     </BrowserRouter>
//   )
// }

// export default App


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
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
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