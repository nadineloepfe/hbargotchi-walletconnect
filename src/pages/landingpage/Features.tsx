import { Card, CardContent, Grid, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import feedImage from '../../assets/hbargotchi-cat.webp';  // Replace with actual image paths
import playImage from '../../assets/hbargotchi-fox.webp';
import giftImage from '../../assets/hbargotchi-penguin.webp';
import "./landingpage.css"; 

export default function Features() {
  return (
    <Box sx={{ py: 5, textAlign: 'center' }}>

<Typography variant="h4" color="white" gutterBottom sx={{ marginBottom: '40px' }}>
        Explore Features
      </Typography>
      {/* Grid container for the 3 feature cards */}
      <Grid container spacing={4} justifyContent="center">  {/* Reduced spacing between cards */}
        
        {/* Feed Card */}
        <Grid item xs={12} md={4}>
          <Card className="feature-card">
            <CardContent className="card-content">
              <Box
                component="img"
                src={feedImage}
                alt="Feed"
                className="feature-image"
              />
              <Typography variant="h5" color="textPrimary" sx={{ mt: 2 }}>
                FEED
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Keep them alive with Tokens
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Play Card */}
        <Grid item xs={12} md={4}>
          <Card className="feature-card">
            <CardContent className="card-content">
              <Box
                component="img"
                src={playImage}
                alt="Play"
                className="feature-image"
              />
              <Typography variant="h5" color="textPrimary" sx={{ mt: 2 }}>
                PLAY
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Send messages to keep them entertained
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gift Card */}
        <Grid item xs={12} md={4}>
          <Card className="feature-card">
            <CardContent className="card-content">
              <Box
                component="img"
                src={giftImage}
                alt="Gift"
                className="feature-image"
              />
              <Typography variant="h5" color="textPrimary" sx={{ mt: 2 }}>
                GIFT
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Going on holiday? Find a pet sitter!
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Adopt Button Below the Features */}
      <Box sx={{ mt: 5 }}>
        <Link to="/adopt" style={{ textDecoration: 'none' }}>
          <Button variant="contained" className="gradientButton">
            Adopt
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
