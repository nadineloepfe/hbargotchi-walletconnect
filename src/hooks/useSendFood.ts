// src/hooks/useSendFood.ts
import { useState } from "react";
import { AccountId, TokenId } from "@hashgraph/sdk";
import { toast } from "react-toastify";

const foodTokenId = TokenId.fromString("0.0.4828893"); // get var from env

export const useSendFood = (walletInterface: any) => {
  const [toAccountId, setToAccountId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [foodDecimals] = useState<number>(2); 

  const handleSendFoodTokens = async () => {
    if (!walletInterface) {
      toast.error("Wallet interface is not available.");
      return;
    }

    if (!toAccountId) {
      toast.error("Please enter a valid account ID.");
      return;
    }

    const amountWithDecimals = amount * Math.pow(10, foodDecimals);
    try {
      const txId = await walletInterface.transferFungibleToken(
        AccountId.fromString(toAccountId),
        foodTokenId,
        amountWithDecimals
      );
      toast.success(`$FOOD sent to ${toAccountId}. Transaction ID: ${txId}`);
    } catch (error: any) {
      toast.error(`Error sending $FOOD: ${error.message}`);
    }
  };

  return {
    toAccountId,
    setToAccountId,
    amount,
    setAmount,
    handleSendFoodTokens,
  };
};
