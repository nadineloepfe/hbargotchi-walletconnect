import React, { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Typography, Stack, Card, CardContent } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AccountId, TokenId } from "@hashgraph/sdk";
import { MirrorNodeAccountTokenBalanceWithInfo, MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetchTokens } from "../hooks/useFetchTokens"; 

const UNSELECTED_SERIAL_NUMBER = -1;

interface TransferFormProps {
  accountId: string | null;
  walletInterface: any;
}

const TransferForm: React.FC<TransferFormProps> = ({ accountId, walletInterface }) => {
  const [toAccountId, setToAccountId] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<number>(UNSELECTED_SERIAL_NUMBER);

  const { availableTokens, error } = useFetchTokens(accountId);

  const tokensWithNonZeroBalance = availableTokens.filter((token) => token.balance > 0);
  const selectedTokenBalanceWithInfo = availableTokens.find((token) => token.token_id === selectedTokenId);

  useEffect(() => {
    setSerialNumber(UNSELECTED_SERIAL_NUMBER);
  }, [selectedTokenId]);

  const handleTransferNft = async () => {
    if (!walletInterface || !selectedTokenBalanceWithInfo || !toAccountId) {
      toast.error("Missing necessary details for NFT transfer.");
      return;
    }

    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
    const isAssociated = await mirrorNodeClient.isAssociated(AccountId.fromString(toAccountId), selectedTokenId);
    if (!isAssociated) {
      toast.error(`Receiver is not associated with token id: ${selectedTokenId}`);
      return;
    }

    try {
      await walletInterface.transferNonFungibleToken(
        AccountId.fromString(toAccountId),
        TokenId.fromString(selectedTokenId),
        serialNumber
      );
      toast.success("NFT transferred successfully!");
    } catch (error) {
      toast.error("Failed to transfer NFT.");
      console.error("Error transferring NFT:", error);
    }
  };

  return (
    <Card className="card">
      <ToastContainer /> {/* Toast container for notifications */}
      <CardContent>
        <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: "20px" }}>
          Transfer Hbargotchi to a Pet Sitter
        </Typography>

        {error && <Typography color="error" align="center">{error}</Typography>}

        <Stack direction="row" justifyContent="center" spacing={2}>
          <TextField
            label="Available Tokens"
            value={selectedTokenId}
            select
            onChange={(e) => setSelectedTokenId(e.target.value)}
            sx={{ width: "250px", height: "50px" }}
          >
            <MenuItem value="">Select a token</MenuItem>
            {tokensWithNonZeroBalance.map((token) => {
              const tokenBalanceAdjustedForDecimals = token.balance / Math.pow(10, Number.parseInt(token.info.decimals));
              return (
                <MenuItem key={token.token_id} value={token.token_id}>
                  {token.info.name} ({token.token_id}): ({tokenBalanceAdjustedForDecimals})
                </MenuItem>
              );
            })}
          </TextField>

          {selectedTokenBalanceWithInfo?.info?.type === "NON_FUNGIBLE_UNIQUE" && (
            <TextField
              label="Serial Number"
              select
              value={serialNumber.toString()}
              onChange={(e) => setSerialNumber(Number.parseInt(e.target.value))}
              sx={{ width: "190px", height: "50px" }}
            >
              <MenuItem value={UNSELECTED_SERIAL_NUMBER}>Select a Serial Number</MenuItem>
              {selectedTokenBalanceWithInfo.nftSerialNumbers?.map((serialNumber) => (
                <MenuItem key={serialNumber} value={serialNumber}>
                  {serialNumber}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Stack>

        <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ marginTop: "20px" }}>
          <TextField
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            label="Account ID"
            sx={{ width: "250px" }}
          />
          <Button
            variant="contained"
            onClick={handleTransferNft}
            sx={{ background: "linear-gradient(90deg, #6a11cb, #2575fc)" }}
          >
            <SendIcon />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TransferForm;
