import Footer from './components/Footer';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/Navbar';
import { Box, ThemeProvider } from '@mui/material';
import { AllWalletsProvider } from './services/wallets/AllWalletsProvider';
import AppRouter from './AppRouter';
import { theme } from './theme';
import { BrowserRouter as Router } from "react-router-dom"; 
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AllWalletsProvider>
        <CssBaseline />
        <Router>  
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              backgroundColor: '#222222',
              backgroundImage: `linear-gradient(to right, #050014, #0a0020, #10002b, #150037, #1b0042, #20004d, #260059, #2b0064)`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <header>
              <NavBar />
            </header>
            <Box
              flex={1}
              p={3}
            >
              <AppRouter />
            </Box>
            <Footer />
          </Box>
        </Router>
      </AllWalletsProvider>
    </ThemeProvider>
  );
}

export default App;
