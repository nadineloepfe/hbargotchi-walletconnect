import * as React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { WalletSelectionDialog } from './WalletSelectionDialog';
import Logo from "../assets/logo.gif"; 
import './Nav.css'; 

const pages = [
  { name: 'Create', path: '/create' },
  { name: 'Manage', path: '/manage' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Transfer', path: '/transfer' }, 
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

  return (
    <AppBar position='relative'>
      <Toolbar className='navBar' sx={{ justifyContent: 'space-between' }}>
        
        {/* Logo Image */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={Logo} alt="Brand Logo" style={{ height: 50 }} /> {/* Adjust the height as needed */}
        </Link>
        
        {/* Regular Link Navigation */}
        <div>
          {pages.map((page) => (
            <Button key={page.name} color="inherit">
              <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                {page.name}
              </Link>
            </Button>
          ))}
        </div>
        
        {/* Wallet Connect Button */}
        <Button
          variant='contained'
          className='connectButton'
          onClick={handleConnect}
        >
          {accountId ? `Connected: ${accountId}` : 'Connect Wallet'}
        </Button>

      </Toolbar>

      <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
    </AppBar>
  );
}
