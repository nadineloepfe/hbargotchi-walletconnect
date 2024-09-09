import { Button, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { AccountId, TokenId, PrivateKey } from "@hashgraph/sdk";

export default function FeedHbargotchi() {
  const { walletInterface, accountId } = useWalletInterface();
  const [foodAmount, setFoodAmount] = useState<number | "">(""); // Handle empty state correctly

  const foodTokenId = TokenId.fromString("0.0.4841066");
  const foodTokenSupplyKey = PrivateKey.fromString("302e020100300506032b657004220420c99c793170e81d0910cb74bc4f4ed8182454e10edc86a4f2d38d970c8e5f7db8") 
  const treasuryAccountId = AccountId.fromString("0.0.4668437"); 

  // Feed the pet (send 20 $FOOD tokens to the treasury)
  const feedHbargotchi = async () => {
    if (!walletInterface || !accountId) return;

    const txId = await walletInterface.transferFungibleToken(
      treasuryAccountId,
      foodTokenId,
      20 // Send 20 $FOOD tokens to the treasury to keep the Hbargotchi alive
    );

    console.log(`Sent 20 $FOOD tokens to the treasury. Transaction ID: ${txId}`);
  };

  // Handle user input for buying $FOOD tokens
  const handleFoodAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value, 10);
    if (!isNaN(amount) && amount > 0) {
      setFoodAmount(amount);
    } else {
      setFoodAmount(""); 
    }
  };

  // Mint food tokens function - to be replaced with actual token swap logic later
  const mintFoodTokens = async () => {
    if (!walletInterface || !accountId || foodAmount === "") return;
    if (foodAmount <= 0) {
      console.log("Please enter a valid amount of $FOOD tokens.");
      return;
    }

    try {
      // Mint the food tokens directly to the user's account
      const txId = await walletInterface.mintFoodTokens(
        foodTokenId, 
        foodAmount,
        foodTokenSupplyKey
      );

      console.log(`Minted ${foodAmount} $FOOD tokens. Transaction ID: ${txId}`);
    } catch (error) {
      console.error("Error minting food tokens: ", error);
    }
  };

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white">
        Feed your Hbargotchi
      </Typography>
      {walletInterface !== null && (
        <>
          {/* Section to feed the pet */}
          <Typography variant="body1" color="white">
            Send 20 $FOOD tokens to keep your Hbargotchi alive for 3 more days!
          </Typography>
          <Button
            variant="contained"
            onClick={feedHbargotchi}
            sx={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}
          >
            Feed
          </Button>

          {/* Section to buy food tokens */}
          <Typography variant="h4" color="white" sx={{ marginTop: '20px' }}>
            Buy $FOOD Tokens
          </Typography>
          <TextField
            type="number"
            label="Amount of $FOOD Tokens"
            value={foodAmount === "" ? "" : foodAmount} 
            onChange={handleFoodAmountChange}
            sx={{ width: '250px' }}
          />
          <Button
            variant="contained"
            onClick={mintFoodTokens} 
            sx={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}
          >
            Buy
          </Button>

          <Stack direction='row' gap={2} alignItems='center'>
            <Button
              variant='contained'
              onClick={async () => {
                await walletInterface.associateToken(foodTokenId);
              }}
            >
              Associate Token
            </Button>
          </Stack>
          
        </>
      )}
    </Stack>
  );
}
