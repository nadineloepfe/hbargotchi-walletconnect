import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { AccountId, TokenInfoQuery, Client, PrivateKey } from "@hashgraph/sdk";
import { MirrorNodeClient, MirrorNodeNftInfo, MirrorNodeTokenInfo } from "../services/wallets/mirrorNodeClient"; // Added MirrorNodeTokenInfo
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { appConfig } from "../config";

export default function View() {
  const { accountId } = useWalletInterface();
  const [availableNfts, setAvailableNfts] = useState<MirrorNodeNftInfo[]>([]);
  const [hbargotchiNfts, setHbargotchiNfts] = useState<MirrorNodeNftInfo[]>([]); 
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [metadataResponse, setMetadataResponse] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);
  const { walletInterface } = useWalletInterface();

  useEffect(() => {
    if (!accountId) return;

    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);

    mirrorNodeClient.getNftInfo(AccountId.fromString(accountId))
      .then((nftInfos) => {
        const fetchHbargotchiTokens = async () => {
          const hbargotchiNftsFiltered = [];
          for (const nft of nftInfos) {
            const tokenInfo: MirrorNodeTokenInfo = await mirrorNodeClient.getTokenInfo(nft.token_id);
            if (tokenInfo.symbol === "HBG") { 
              hbargotchiNftsFiltered.push(nft);
            }
          }
          setHbargotchiNfts(hbargotchiNftsFiltered);
        };

        fetchHbargotchiTokens();
      })
      .catch(error => console.error("Error fetching NFTs:", error));
  }, [accountId]);

    // ----------------------------------------------
  // NOTE: Mirror Node version 
  // ----------------------------------------------
  // const fetchMetadata = async () => {
  //   if (!selectedTokenId) return;

  //   const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);

  //   try {
  //     const nftDetails = await mirrorNodeClient.getNftDetails(selectedTokenId);
  //     const rawMetadata = JSON.stringify(nftDetails, null, 2); 
  //     setMetadataResponse(rawMetadata);
  //     setShowMetadata(true);
  //   } catch (error) {
  //     console.error("Error fetching NFT details:", error);
  //   }
  // };

  // ----------------------------------------------
  // NOTE: walletConnect version 
  // ----------------------------------------------
  const fetchMetadata = async () => {
    if (!selectedTokenId || !walletInterface) {
      console.error("No token selected or wallet interface is unavailable.");
      return;
    }
  
    try {
      const metadata = await walletInterface.fetchTokenInfo(selectedTokenId);
      
      if (metadata) {
        setMetadataResponse(metadata);
        setShowMetadata(true);
      } else {
        console.error("No metadata available");
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  // ----------------------------------------------
  // NOTE: Vanilla JS/hardcoded client version 
  // ----------------------------------------------
  // const fetchMetadata = async () => {
  //   const operatorId = AccountId.fromString("")
  //   const operatorKey = PrivateKey.fromString("");
  //   const client = Client.forTestnet().setOperator(operatorId, operatorKey);
  //   try {
  //     // Create the query for token info
  //     const tokenInfo = await new TokenInfoQuery().setTokenId(selectedTokenId).execute(client);
  
  //     // Log token info
  //     console.log("Token Info:", tokenInfo);
  
  //     // If metadata exists, decode it
  //     if (tokenInfo.metadata) {
  //           console.log(tokenInfo.metadata)
  //         } else {
  //           console.error("No metadata available");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching metadata:", error);
  //       }
  //     };

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white">
        View Hbargotchi
      </Typography>

      <TextField
        label='Select Hbargotchi NFT'
        value={selectedTokenId}
        select
        onChange={(e) => setSelectedTokenId(e.target.value)}
        sx={{ width: '250px', height: '50px' }}
      >
        <MenuItem value=''>Select a token</MenuItem>
        {hbargotchiNfts.map((nft) => (
          <MenuItem key={nft.token_id} value={nft.token_id}>
            {nft.token_id} (Serial: {nft.serial_number})
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

      {showMetadata && metadataResponse && (
        <div>
          <Typography variant="h5" color="white">NFT Metadata (Raw JSON):</Typography>
          <TextField
            multiline
            fullWidth
            rows={10}
            value={metadataResponse}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              backgroundColor: "black", 
              color: "white",            
              borderRadius: "5px",
              padding: "10px",
              marginTop: "10px",
              width: '100%'
            }}
          />
        </div>
      )}
    </Stack>
  );
}
