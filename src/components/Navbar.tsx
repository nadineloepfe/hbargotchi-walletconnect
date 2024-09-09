import * as React from 'react';
import { AppBar, Button, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { WalletSelectionDialog } from './WalletSelectionDialog';
import MenuIcon from '@mui/icons-material/Menu'; 
import Logo from "../assets/hbar-logo.svg"; 
import './Navbar.css'; 

const pages = [
  { name: 'Adopt', path: '/adopt' },
  { name: 'View', path: '/view' },
  { name: 'Feed', path: '/feed' }, 
  { name: 'Community', path: '/community' }, 
  { name: 'Gift', path: '/gift' },
  // { name: 'FAQ', path: '/faq' }
];

export default function NavBar() {
  const [open, setOpen] = React.useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  React.useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  const handleMenuClick = () => {
    alert('Open mobile menu here');
  };

  return (
    <AppBar position='relative'>
      <Toolbar className='navBar' sx={{ justifyContent: 'space-between' }}>
        
        {/* Logo and HBG Text */}
        <Box display="flex" alignItems="center">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={Logo} alt="Brand Logo" style={{ height: 30, marginRight: 8 }} />
          </Link>
          <Typography variant="h6" className='logo-title' color="white">
            HBG
          </Typography>
        </Box>

        {/* Conditional Rendering of Navigation Links */}
        {accountId && (
          <Box className="nav-links">
            {pages.map((page) => (
              <Button key={page.name} color="inherit" sx={{ marginRight: 4 }}>
                <Link
                  to={page.path}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    fontFamily: 'TamaConnectType, sans-serif',
                    fontWeight: 'normal',
                  }}
                >
                  {page.name}
                </Link>
              </Button>
            ))}
          </Box>
        )}

        {/* Hamburger menu for mobile */}
        <IconButton
          className="menu-icon"
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: 'none' }} 
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>

        {/* Wallet Connect Button */}
        <Button
          variant='contained'
          className='gradientButton'
          onClick={handleConnect}
        >
          {accountId ? `Connected: ${accountId}` : 'Connect Wallet'}
        </Button>

      </Toolbar>

      <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
    </AppBar>
  );
}
