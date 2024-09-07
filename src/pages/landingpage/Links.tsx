import { Grid, Typography, Box, Link as MuiLink } from "@mui/material";
import footerImage from '../../assets/footer.png'; // Image to display on the left

export default function ConnectSection() {
  return (
    <Box sx={{ py: 5 }}>
      <Grid container spacing={10} alignItems="center">  {/* Reduced spacing to bring elements closer */}
        
        {/* Left Side: Image */}
        <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>  {/* Align image to the midline */}
          <Box
            component="img"
            src={footerImage}
            alt="Hbargotchi Frog"
            sx={{
              width: '75%',  // Adjusted width
              height: 'auto',
              borderRadius: '100%',  
              boxShadow: 3           
            }}
          />
        </Grid>

        {/* Right Side: "Connect" and Links */}
        <Grid item xs={12} md={5}>  {/* Adjusted to make room for the image */}
          <Typography variant="h6" color="primary" gutterBottom>
            Connect
          </Typography>
          <Grid container spacing={3}>  {/* Reduced spacing between link sections */}
            {/* Links Section */}
            <Grid item>
              <MuiLink href="/terms" color="inherit" sx={{ display: 'block', marginBottom: 1 }}>
                Terms
              </MuiLink>
              <MuiLink href="/whitepaper" color="inherit" sx={{ display: 'block', marginBottom: 1 }}>
                Whitepaper
              </MuiLink>
            </Grid>

            {/* Social Media Section */}
            <Grid item>
              <MuiLink href="https://twitter.com" target="_blank" color="inherit" sx={{ display: 'block', marginBottom: 1 }}>
                X
              </MuiLink>
              <MuiLink href="https://hashscan.io" target="_blank" color="inherit" sx={{ display: 'block', marginBottom: 1 }}>
                Hashscan
              </MuiLink>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
}
