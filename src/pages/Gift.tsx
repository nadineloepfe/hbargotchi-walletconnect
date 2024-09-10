import React from "react";
import { Stack, Typography } from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import TransferForm from "../components/TransferForm";
import SendFoodForm from "../components/SendFoodForm";
import "../App.css";

export default function Gift() {
  const { walletInterface, accountId } = useWalletInterface();

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white" align="center">
        Donate
      </Typography>
      {walletInterface && (
        <div className="card-wrapper">
          <TransferForm accountId={accountId} walletInterface={walletInterface} />
          <SendFoodForm walletInterface={walletInterface} /> 
        </div>
      )}
    </Stack>
  );
}