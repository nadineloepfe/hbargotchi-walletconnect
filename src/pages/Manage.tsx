import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { AccountId } from "@hashgraph/sdk";
import { MirrorNodeClient, MirrorNodeNftInfo } from "../services/wallets/mirrorNodeClient";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { appConfig } from "../config";

export default function Manage() {
  const { accountId } = useWalletInterface();
  const [availableNfts, setAvailableNfts] = useState<MirrorNodeNftInfo[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [metadataUri, setMetadataUri] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);

  // Fetch NFT info when accountId changes
  useEffect(() => {
    if (!accountId) return;

    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);

    // Fetch NFT info for the user's account
    mirrorNodeClient.getNftInfo(AccountId.fromString(accountId))
      .then((nftInfos) => {
        setAvailableNfts(nftInfos);
      })
      .catch(error => console.error("Error fetching NFTs:", error));
  }, [accountId]);

  // Fetch NFT metadata when token ID is selected
  const fetchMetadata = () => {
    if (!selectedTokenId) return;

    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);

    mirrorNodeClient.getNftDetails(selectedTokenId)
      .then((nftDetails) => {
        // Use atob to decode base64 encoded metadata
        const metadataBuffer = atob(nftDetails.metadata);
        setMetadataUri(metadataBuffer);
        setShowMetadata(true); // Display the metadata once fetched
      })
      .catch(error => console.error("Error fetching NFT details:", error));
  };

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white">
        Manage Hbargotchi
      </Typography>

      <TextField
        label='Select NFT'
        value={selectedTokenId}
        select
        onChange={(e) => setSelectedTokenId(e.target.value)}
        sx={{ width: '250px', height: '50px' }}
      >
        <MenuItem value=''>Select a token</MenuItem>
        {availableNfts.map((nft) => (
          <MenuItem key={nft.token_id} value={nft.token_id}>
            {nft.token_id}
          </MenuItem>
        ))}
      </TextField>

      {selectedTokenId && (
        <Button
          variant="contained"
          onClick={fetchMetadata}
          sx={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}
        >
          Fetch Metadata
        </Button>
      )}

      {showMetadata && metadataUri && (
        <div>
          <Typography variant="h5" color="white">NFT Metadata:</Typography>
          <img src={metadataUri} alt="Hbargotchi" style={{ width: '250px', borderRadius: '10px' }} />
        </div>
      )}
    </Stack>
  );
}
