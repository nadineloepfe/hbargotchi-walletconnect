import { Button, MenuItem, TextField, Typography, Card, CardContent } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from "react";
import { AccountId, TokenId } from "@hashgraph/sdk";
import { MirrorNodeAccountTokenBalanceWithInfo, MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";
import "../App.css";

const UNSELECTED_SERIAL_NUMBER = -1;
const foodTokenId = TokenId.fromString("0.0.4828893");

export default function Gift() {
  const { walletInterface, accountId } = useWalletInterface();
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<MirrorNodeAccountTokenBalanceWithInfo[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string>('');
  const [serialNumber, setSerialNumber] = useState<number>(UNSELECTED_SERIAL_NUMBER);
  const [foodDecimals, setFoodDecimals] = useState<number>(2);

  useEffect(() => {
    if (accountId === null) return;
    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
    mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(AccountId.fromString(accountId))
      .then((tokens) => {
        const hbargotchiTokens = tokens.filter((token) => token.info.symbol === "HBG");
        setAvailableTokens(hbargotchiTokens);
      })
      .catch((error) => console.error(error));
  }, [accountId]);

  const tokensWithNonZeroBalance = availableTokens.filter((token) => token.balance > 0);
  const selectedTokenBalanceWithInfo = availableTokens.find((token) => token.token_id === selectedTokenId);

  useEffect(() => {
    setAmount(0);
    setSerialNumber(UNSELECTED_SERIAL_NUMBER);
  }, [selectedTokenId]);

  // Separate function for transferring NFT
  const handleTransferNft = async () => {
    if (!walletInterface) {
      console.log("Wallet interface is not available.");
      return;
    }
    if (selectedTokenBalanceWithInfo === undefined) {
      console.log(`Token Id is empty.`);
      return;
    }
    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
    const isAssociated = await mirrorNodeClient.isAssociated(AccountId.fromString(toAccountId), selectedTokenId);
    if (!isAssociated) {
      console.log(`Receiver is not associated with token id: ${selectedTokenId}`);
      return;
    }
    await walletInterface.transferNonFungibleToken(
      AccountId.fromString(toAccountId),
      TokenId.fromString(selectedTokenId),
      serialNumber
    );
  };

  // Separate function for sending food tokens
  const handleSendFoodTokens = async () => {
    if (!walletInterface) {
      console.log("Wallet interface is not available.");
      return;
    }
    const amountWithDecimals = amount * Math.pow(10, foodDecimals);
    const txId = await walletInterface.transferFungibleToken(
      AccountId.fromString(toAccountId),
      foodTokenId,
      amountWithDecimals
    );
    console.log(`$FOOD sent to ${toAccountId}. Transaction ID: ${txId}`);
  };

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white" align="center">
        Donate
      </Typography>
      {walletInterface !== null && (
        <div className="card-wrapper">
          {/* Card for transferring Hbargotchi */}
          <Card className="card">
            <CardContent>
              <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: '20px' }}>
                Transfer Hbargotchi to a Pet Sitter
              </Typography>
              <Stack direction="row" justifyContent="center" spacing={2}>
                <TextField
                  label="Available Tokens"
                  value={selectedTokenId}
                  select
                  onChange={(e) => setSelectedTokenId(e.target.value)}
                  sx={{ width: '250px', height: '50px' }}
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
                    sx={{ width: '190px', height: '50px' }}
                  >
                    <MenuItem value={UNSELECTED_SERIAL_NUMBER}>Select a Serial Number</MenuItem>
                    {selectedTokenBalanceWithInfo.nftSerialNumbers?.map((serialNumber) => (
                      <MenuItem key={serialNumber} value={serialNumber}>{serialNumber}</MenuItem>
                    ))}
                  </TextField>
                )}
              </Stack>
              <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ marginTop: '20px' }}>
                <TextField
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  label="Account ID"
                  sx={{ width: '250px' }}
                />
                <Button
                  variant="contained"
                  onClick={handleTransferNft}
                  sx={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}
                >
                  <SendIcon />
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Card for sending food tokens */}
          <Card className="card">
            <CardContent>
              <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: '20px' }}>
                Send $FOOD Tokens
              </Typography>
              <Stack direction="row" justifyContent="center" spacing={2}>
                <TextField
                  type="number"
                  label="Amount"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  sx={{ width: '150px' }}
                />
                <TextField
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  label="Account ID"
                  sx={{ width: '250px' }}
                />
              </Stack>
              <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ marginTop: '20px' }}>
                <Button
                  variant="contained"
                  onClick={handleSendFoodTokens}
                  sx={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}
                >
                  <SendIcon />
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </div>
      )}
    </Stack>
  );
}
