import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import introImage from '../../assets/hbg-squirrel.webp'; // Replace with your actual image path

export default function Intro() {
  return (
    <Box sx={{ py: 5 }}>
      <Card 
        sx={{ 
          maxWidth: '1200px',  // Increased the maxWidth for a wider card
          mx: 'auto', 
          borderRadius: '16px', 
          boxShadow: 3, 
          padding: 4, // Keep padding to add spacing inside the card
          width: '90%', // Ensure it takes up 90% of the viewport width, making it fluid
        }}
      >
        <CardContent>
          <Grid container spacing={7} alignItems="center">
            
            {/* Left Side: Image */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={introImage}
                alt="Intro"
                sx={{
                  width: '80%',         // Set image width to 80%
                  height: 'auto',
                  borderRadius: '20%',
                }}
              />
            </Grid>
            
            {/* Right Side: Text */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color="primary" gutterBottom>
                Your pet in web3
              </Typography>
              <br />
              <Typography variant="body1" color="textSecondary">
                Explore the world of Hbargotchi, where you can mint, adopt, and care for your own digital pet using the power of Hedera Hashgraph.
              </Typography>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
