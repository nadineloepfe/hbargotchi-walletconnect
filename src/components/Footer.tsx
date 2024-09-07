import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ background: 'black', color: 'grey', padding: 1, textAlign: 'center' }}>
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Styrene A Web, sans-serif',  
          fontSize: '0.8rem',                      
          color: 'grey'                          
        }}
      >
        Privacy Policy
      </Typography>
    </Box>
  );
}
