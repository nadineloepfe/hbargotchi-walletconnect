import { Button, TextField, Typography, Card, CardContent } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { AccountId, TokenId, PrivateKey } from "@hashgraph/sdk";
import { useTokenOperations } from "../hooks/useTokenOperations"; 
import "../App.css"; 

export default function FeedHbargotchi() {
  const { walletInterface, accountId } = useWalletInterface();
  const [foodAmount, setFoodAmount] = useState<number | "">(""); 

  const foodTokenId = TokenId.fromString("");
  const treasuryAccountId = AccountId.fromString("");
  const foodTokenSupplyKey = PrivateKey.fromString("");


  const { transferTokens, mintTokens, loading } = useTokenOperations(walletInterface, accountId);

  const handleFoodAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value, 10);
    if (!isNaN(amount) && amount > 0) {
      setFoodAmount(amount);
    } else {
      setFoodAmount(""); 
    }
  };

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white" align="center">
        Feed
      </Typography>
      {walletInterface && (
        <Stack spacing={4} className="card-wrapper">
          {/* Card for feeding Hbargotchi */}
          <Card className="card">
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Top up
              </Typography>
              <Typography variant="body1" color="white" align="center">
                Send 20 $FOOD tokens to keep your Hbargotchi alive for 3 more days!
              </Typography>
              <Stack alignItems="center" mt={2}>
                <Button
                  variant="contained"
                  onClick={() => transferTokens(treasuryAccountId, foodTokenId, 20)}
                  className="gradientButton"
                  disabled={loading} // Disable button while loading
                >
                  Feed
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Card for buying $FOOD tokens */}
          <Card className="card">
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Buy $FOOD Tokens
              </Typography>
              <Stack alignItems="center" spacing={2} mt={2}>
                <TextField
                  type="number"
                  label="Amount of $FOOD Tokens"
                  value={foodAmount === "" ? "" : foodAmount}
                  onChange={handleFoodAmountChange}
                  className="text-field"
                />
                <Button
                  variant="contained"
                  onClick={() => mintTokens(foodTokenId, Number(foodAmount), foodTokenSupplyKey)}
                  className="gradientButton"
                  disabled={loading} // Disable button while loading
                >
                  Buy
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Stack direction="row" gap={2} alignItems="center" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              onClick={async () => {
                await walletInterface.associateToken(foodTokenId);
              }}
              className="gradientButton"
            >
              Associate Token
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
