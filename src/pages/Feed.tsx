import { Button, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { AccountId, TokenId } from "@hashgraph/sdk";

export default function FeedHbargotchi() {
  const { walletInterface, accountId } = useWalletInterface();
  const [foodAmount, setFoodAmount] = useState<number | "">(""); // Handle empty state correctly
  const [hbarCost, setHbarCost] = useState(0); 

  const foodTokenId = TokenId.fromString("0.0.4828893"); 
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
      setHbarCost(amount / 5); // 1 HBAR is worth 5 $FOOD tokens
    } else {
      setFoodAmount(""); // Clear the input on invalid amount
      setHbarCost(0);
    }
  };

  // Buy food tokens function
  const buyFoodTokens = async () => {
    if (!walletInterface || !accountId || foodAmount === "") return;
    if (foodAmount <= 0) {
      console.log("Please enter a valid amount of $FOOD tokens.");
      return;
    }

    const hbarAmount = hbarCost; // Calculate how much HBAR will be sent to the treasury

    // Send HBAR to the treasury in exchange for $FOOD tokens
    const txId = await walletInterface.transferHBAR(
      treasuryAccountId, 
      hbarAmount // Send the HBAR equivalent of the $FOOD tokens
    );

    console.log(`Purchased ${foodAmount} $FOOD tokens for ${hbarAmount} HBAR. Transaction ID: ${txId}`);

    // In a real-world scenario, the treasury would then distribute the equivalent $FOOD tokens back to the user
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
            value={foodAmount === "" ? "" : foodAmount} // Ensure it shows empty instead of "0"
            onChange={handleFoodAmountChange}
            sx={{ width: '250px' }}
          />
          <Typography variant="body1" color="white">
            {`This will cost ${hbarCost} HBAR`}
          </Typography>
          <Button
            variant="contained"
            onClick={buyFoodTokens}
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
