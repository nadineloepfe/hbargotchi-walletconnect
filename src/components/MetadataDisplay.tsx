import React from 'react';
import { Typography, Box } from "@mui/material";

const MetadataDisplay = ({ metadata }: { metadata: any }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ marginTop: '20px' }}>
      {metadata.files && metadata.files.length > 0 && (
        <Box flex={1} display="flex" justifyContent="center" alignItems="center" sx={{ marginRight: '20px' }}>
          <img
            src={metadata.files[0].uri.replace("ipfs://", "https://ipfs.io/ipfs/")}
            alt={metadata.name}
            style={{ maxWidth: "100%", maxHeight: "400px", display: "block" }}
          />
        </Box>
      )}

      <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
        <Typography variant="h4" color="primary" gutterBottom>{metadata.name}</Typography>
        <Typography variant="h6" color="white">Rarity: {metadata.properties.rarity}</Typography>
        <Typography variant="h6" color="white">Character: {metadata.properties.character}</Typography>
        <Typography variant="h6" color="white">Happiness: {metadata.properties.happiness}</Typography>
        <Typography variant="h6" color="white">Playscore: {metadata.properties.playscore}</Typography>
      </Box>
    </Box>
  );
};

export default MetadataDisplay;
