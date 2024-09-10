import { useEffect, useState } from "react";
import { Typography, Box, Stack, Button } from "@mui/material";
import NftDropdown from "../components/NftDropdown"; 
import SerialNumberDropdown from "../components/SerialNumberDropdown"; 
import { fetchNftMetadata, fetchHbargotchiNfts } from "../services/tokenService"; 
import { updatePlayScoreAndHappiness } from "../services/playService"; 
import { uploadJsonToPinata } from "../services/ipfsService"; 
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { useNavigate } from "react-router-dom";
import { TokenId, PrivateKey } from "@hashgraph/sdk";
import { SupportOutlined } from "@mui/icons-material";

export default function View() {
  const { accountId, walletInterface } = useWalletInterface(); 
  const [nfts, setNfts] = useState<any[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNfts = async () => {
      if (accountId) {
        try {
          const fetchedNfts = await fetchHbargotchiNfts(accountId);
          setNfts(fetchedNfts);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
      }
    };
    fetchNfts();
  }, [accountId]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (selectedTokenId && selectedSerialNumber) {
        try {
          const jsonMetadata = await fetchNftMetadata(selectedTokenId, selectedSerialNumber);
          console.log("Fetched Metadata:", jsonMetadata);
          setMetadata(jsonMetadata);
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      }
    };

    fetchMetadata();
  }, [selectedTokenId, selectedSerialNumber]);

  const handlePlay = async () => {
    if (!accountId) {
      console.error("Error: No accountId found");
      return;
    }

    if (metadata) {
      const updatedMetadata = updatePlayScoreAndHappiness(metadata);

      try {
        // Upload updated metadata to Pinata and get the IPFS hash
        const ipfsHash = await uploadJsonToPinata(updatedMetadata);
        console.log(`New metadata file uploaded to IPFS: ${ipfsHash}`);

        // Construct the new metadata URI using the IPFS hash
        const newMetadataUri = `ipfs://${ipfsHash}`;

        if (selectedTokenId && selectedSerialNumber) {
          const tokenId = selectedTokenId; 
          const serialNumber = selectedSerialNumber; 

          const supplyKey = PrivateKey.generate();  // -> to be replaced
          
          const transactionId = await walletInterface.updateNftMetadata(tokenId, serialNumber, newMetadataUri, supplyKey);
          console.log(`NFT metadata updated. Transaction ID: ${transactionId}`);
        }
      } catch (error) {
        console.error("Error uploading metadata to Pinata or updating NFT metadata:", error);
      }
    } else {
      console.log("No metadata available to update.");
    }
  };

  const handleFeed = () => {
    navigate("/feed");
  };

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white">View</Typography>

      <NftDropdown nfts={nfts} selectedTokenId={selectedTokenId} onSelect={setSelectedTokenId} />

      {selectedTokenId && selectedSerialNumber !== 1 && (
        <SerialNumberDropdown
          nfts={nfts}
          selectedTokenId={selectedTokenId}
          selectedSerialNumber={selectedSerialNumber ?? ""}
          onSelect={setSelectedSerialNumber}
        />
      )}

      {metadata && (
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
      )}

      <Stack direction="row" spacing={2} mt={4}>
        <Button variant="contained" color="primary" onClick={handlePlay}>Play</Button>
        <Button variant="contained" color="secondary" onClick={handleFeed}>Feed</Button>
      </Stack>
    </Stack>
  );
}