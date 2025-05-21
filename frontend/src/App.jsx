
import './App.css'
import { ThemeProvider, StyledEngineProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import Router from './Routes/routes';
import theme from './utils/theme'

function App() {


  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
      </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  )
}

export default App
