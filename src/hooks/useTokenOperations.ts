// src/hooks/useTokenOperations.ts
import { useState } from "react";
import { AccountId, TokenId, PrivateKey } from "@hashgraph/sdk";
import { toast } from "react-toastify";

export const useTokenOperations = (walletInterface: any, accountId: string | null) => {
  const [loading, setLoading] = useState(false);

  const transferTokens = async (toAccountId: AccountId, tokenId: TokenId, amount: number) => {
    if (!walletInterface || !accountId) {
      toast.error("Wallet interface or account ID is missing.");
      return;
    }

    try {
      setLoading(true);
      const txId = await walletInterface.transferFungibleToken(toAccountId, tokenId, amount);
      toast.success(`Transferred ${amount} tokens. Transaction ID: ${txId}`);
      return txId;
    } catch (error) {
      console.error("Error transferring tokens: ", error);
      toast.error("Error transferring tokens.");
    } finally {
      setLoading(false);
    }
  };

  const mintTokens = async (tokenId: TokenId, amount: number, supplyKey: PrivateKey) => {
    if (!walletInterface || !accountId || amount <= 0) {
      toast.error("Invalid input for minting tokens.");
      return;
    }

    try {
      setLoading(true);
      const txId = await walletInterface.mintFoodTokens(tokenId, amount, supplyKey);
      toast.success(`Minted ${amount} tokens. Transaction ID: ${txId}`);
      return txId;
    } catch (error) {
      console.error("Error minting tokens: ", error);
      toast.error("Error minting tokens.");
    } finally {
      setLoading(false);
    }
  };

  return {
    transferTokens,
    mintTokens,
    loading,
  };
};
