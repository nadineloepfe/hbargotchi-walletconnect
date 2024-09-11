import { useState } from "react";
import { Typography, Stack, Button } from "@mui/material";
import { PrivateKey } from "@hashgraph/sdk";
import NftDropdown from "../components/NftDropdown";
import SerialNumberDropdown from "../components/SerialNumberDropdown";
import MetadataDisplay from "../components/MetadataDisplay"; 
import { updateNftMetadata } from "../services/tokenService";
import { updatePlayScoreAndHappiness } from "../services/playService"; 
import { uploadJsonToPinata } from "../services/ipfsService";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { useNavigate } from "react-router-dom";
import useFetchNfts from "../hooks/useFetchNfts";
import useFetchMetadata from "../hooks/useFetchMetadata";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function View() {
  const { accountId } = useWalletInterface();
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<number | null>(null);
  const navigate = useNavigate();
  const { nfts, loading: nftLoading } = useFetchNfts(accountId); 
  const { metadata, loading: metadataLoading, error: metadataError } = useFetchMetadata(selectedTokenId, selectedSerialNumber); 

  const handlePlay = async () => {
    if (!accountId) {
      toast.error("No accountId found");
      return;
    }

    if (metadata) {
      const updatedMetadata = updatePlayScoreAndHappiness(metadata);
      try {
        const ipfsHash = await uploadJsonToPinata(updatedMetadata);
        const newMetadataUri = `ipfs://${ipfsHash}`;
        const metadataKey = PrivateKey.fromString("302e020100300506032b657004220420e08385da6828e6f8b5d11035870f89918f9220778b7da2bbf0239e9f37afe461");

        if (selectedTokenId && selectedSerialNumber) {
          console.log("Updating metadata now")
          await updateNftMetadata(selectedTokenId, selectedSerialNumber, newMetadataUri, metadataKey);
          toast.success(`NFT metadata updated`);
        }
      } catch (error) {
        console.log(error)
        toast.error("Error updating NFT metadata");
      }
    } else {
      toast.warning("No metadata available to update");
    }
  };

  const handleFeed = () => {
    navigate("/feed");
  };

  return (
    <Stack alignItems="center" spacing={4}>
      <ToastContainer />
      <Typography variant="h4" color="white">View</Typography>

      {nftLoading ? (
        <Typography variant="h6" color="white">Loading NFTs...</Typography>
      ) : (
        <NftDropdown nfts={nfts} selectedTokenId={selectedTokenId} onSelect={setSelectedTokenId} />
      )}

      {selectedTokenId && selectedSerialNumber !== 1 && (
        <SerialNumberDropdown
          nfts={nfts}
          selectedTokenId={selectedTokenId}
          selectedSerialNumber={selectedSerialNumber ?? ""}
          onSelect={setSelectedSerialNumber}
        />
      )}

      {metadataLoading ? (
        <Typography variant="h6" color="white">Loading Metadata...</Typography>
      ) : metadataError ? (
        <Typography variant="h6" color="red">Error: {metadataError}</Typography>
      ) : metadata ? (
        <MetadataDisplay metadata={metadata} />
      ) : (
        <Typography variant="h6" color="white">Select an NFT to see details</Typography>
      )}

      <Stack direction="row" spacing={2} mt={4}>
        <Button variant="contained" color="primary" onClick={handlePlay}>Play</Button>
        <Button variant="contained" color="secondary" onClick={handleFeed}>Feed</Button>
      </Stack>
    </Stack>
  );
}
