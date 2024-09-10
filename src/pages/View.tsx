import { useEffect, useState } from "react";
import { Typography, Box, Stack, Button } from "@mui/material";
import NftDropdown from "../components/NftDropdown"; // Assuming you have this component for NFT selection
import SerialNumberDropdown from "../components/SerialNumberDropdown"; // Assuming a dropdown for serial numbers
import { fetchNftMetadata, fetchHbargotchiNfts } from "../services/tokenService"; 
import { updatePlayScore } from "../services/playService"; // This is the logic to update metadata
import { useWalletInterface } from "../services/wallets/useWalletInterface"; // Assuming this gets accountId or wallet info

export default function View() {
  const { accountId } = useWalletInterface(); // Get accountId
  const [nfts, setNfts] = useState<any[]>([]); // Store NFTs fetched from an API
  const [selectedTokenId, setSelectedTokenId] = useState<string>(''); // Store selected token ID
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null); // Store selected serial number
  const [metadata, setMetadata] = useState<any>(null); // Store fetched metadata

  // Fetch NFTs when the component mounts
  useEffect(() => {
    const fetchNfts = async () => {
      if (accountId) { // Ensure accountId is available
        try {
          const fetchedNfts = await fetchHbargotchiNfts(accountId); // Fetching NFTs for this accountId
          setNfts(fetchedNfts);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
      }
    };

    fetchNfts();
  }, [accountId]); // Run when accountId changes

  // Fetch metadata when a token ID and serial number are selected
  useEffect(() => {
    const fetchMetadata = async () => {
      if (selectedTokenId && selectedSerialNumber) {
        try {
          const jsonMetadata = await fetchNftMetadata(selectedTokenId, selectedSerialNumber);
          console.log("Fetched Metadata:", jsonMetadata); // Log the fetched metadata
          setMetadata(jsonMetadata);
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      }
    };

    fetchMetadata();
  }, [selectedTokenId, selectedSerialNumber]);

  // Play button handler - logs the updated metadata
  const handlePlay = () => {
    if (metadata) {
      const updatedMetadata = updatePlayScore(metadata); // Apply play logic
      console.log("Updated Metadata:", updatedMetadata); // Log the updated metadata
    } else {
      console.log("No metadata available to update.");
    }
  };

  // Feed button handler - just logs a message for now
  const handleFeed = () => {
    console.log("Feed action triggered"); // Log a message for now
  };

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white">
        View
      </Typography>

      {/* Dropdown for selecting NFTs */}
      <NftDropdown
        nfts={nfts} // Dynamically pass fetched NFTs
        selectedTokenId={selectedTokenId}
        onSelect={setSelectedTokenId}
      />

      {/* Dropdown for selecting Serial Number, only if a token is selected and serial is NOT 1 */}
      {selectedTokenId && selectedSerialNumber !== 1 && (
        <SerialNumberDropdown
          nfts={nfts} // Pass the NFTs related to the selected token
          selectedTokenId={selectedTokenId}
          selectedSerialNumber={selectedSerialNumber ?? ""}
          onSelect={setSelectedSerialNumber}
        />
      )}

      {/* Display metadata if available */}
      {metadata && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          sx={{ marginTop: '20px' }}
        >
          {/* Image Section on the left */}
          {metadata.files && metadata.files.length > 0 && (
            <Box flex={1} display="flex" justifyContent="center" alignItems="center" sx={{ marginRight: '20px' }}>
              <img
                src={metadata.files[0].uri.replace("ipfs://", "https://ipfs.io/ipfs/")}
                alt={metadata.name}
                style={{ maxWidth: "100%", maxHeight: "400px", display: "block" }}
              />
            </Box>
          )}

          {/* Properties Section on the right */}
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
            <Typography variant="h3" color="white" gutterBottom>
              {metadata.name}
            </Typography>
            <Typography variant="h6" color="white">
              Rarity: {metadata.properties.rarity}
            </Typography>
            <Typography variant="h6" color="white">
              Character: {metadata.properties.character}
            </Typography>
            <Typography variant="h6" color="white">
              Happiness: {metadata.properties.happiness}
            </Typography>
            <Typography variant="h6" color="white">
              Playscore: {metadata.properties.playscore}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Always show Play and Feed buttons */}
      <Stack direction="row" spacing={2} mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlay} // Call handlePlay on click
        >
          Play
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleFeed} // Call handleFeed on click
        >
          Feed
        </Button>
      </Stack>
    </Stack>
  );
}


