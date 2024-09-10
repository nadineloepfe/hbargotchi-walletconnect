// src/components/SendFoodForm.tsx
import React from "react";
import { Button, TextField, Typography, Stack, Card, CardContent } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSendFood } from "../hooks/useSendFood"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SendFoodFormProps {
  walletInterface: any;
}

const SendFoodForm: React.FC<SendFoodFormProps> = ({ walletInterface }) => {
  const { toAccountId, setToAccountId, amount, setAmount, handleSendFoodTokens } = useSendFood(walletInterface);

  return (
    <Card className="card">
      <ToastContainer /> 
      <CardContent>
        <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: "20px" }}>
          Send $FOOD Tokens
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={2}>
          <TextField
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            sx={{ width: "150px" }}
          />
          <TextField
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            label="Account ID"
            sx={{ width: "250px" }}
          />
        </Stack>
        <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            onClick={handleSendFoodTokens}
            sx={{ background: "linear-gradient(90deg, #6a11cb, #2575fc)" }}
          >
            <SendIcon />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SendFoodForm;
