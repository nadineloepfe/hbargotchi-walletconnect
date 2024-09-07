import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/heroimg.webp'; 
import { Button, Box, Typography } from '@mui/material';
import "./landingpage.css"; 
import "../../App.css"; 


const Hero = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <Box 
      py={5} 
      display="flex" 
      flexDirection={{ xs: 'column', md: 'row' }} 
      alignItems="center" 
      justifyContent="space-between"
      sx={{ gap: { xs: 4, md: 20 } }}
    >
      {/* Left Side: Text content */}
      <Box 
        textAlign={{ xs: 'center', md: 'left' }} 
        mb={4} 
        className={animate ? 'fly-in-left' : ''} 
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to
          <br />
          <Typography
  component="span"
  variant="h2"
  color="primary"
  fontWeight="bold"
  sx={{
    fontSize: {
      xs: '2.5rem', // Extra small devices (phones, less than 600px)
      sm: '3rem',   // Small devices (600px and up)
      md: '3.5rem',   // Medium devices (960px and up)
      lg: '4rem',   // Large devices (1280px and up)
      xl: '5rem'    // Extra large devices (1920px and up)
    }
  }}
>
  Hbargotchi
</Typography>
        </Typography>
        <Box mt={5}>
          <Link to="/adopt" style={{ textDecoration: 'none' }}>
            <Button variant="contained" 
              className="gradientButton" 
              color="primary" 
              sx={{ mr: 5 }}>
              Get started
            </Button>
          </Link>
          <Link to="/faq" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary" >
              Learn More
            </Button>
          </Link>
        </Box>
      </Box>

      <Box 
        component="img" 
        src={heroImage} 
        alt="Hbargotchi Image" 
        className={animate ? 'fly-in-right' : ''} 
        sx={{
          width: {
            xs: '100%',   // Full width for extra small devices (mobile)
            sm: '80%',    // 80% width for small devices
            md: '70%',    // 70% width for medium devices (tablets)
            lg: '60%',    // 60% width for large devices (laptops)
            xl: '50%'     // 50% width for extra-large devices (desktops)
          },
          maxWidth: 600, 
          borderRadius: 30, 
          boxShadow: 3
        }}
      />
    </Box>
  );
};

export { Hero };
