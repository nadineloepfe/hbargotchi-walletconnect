import { AccountId, ContractId, TokenId } from "@hashgraph/sdk";
import { Button, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { ContractFunctionParameterBuilder } from "../services/wallets/contractFunctionParameterBuilder";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { Hero } from './landingpage/Hero';
import Intro from './landingpage/Intro';
import Features from './landingpage/Features';
import Links from './landingpage/Links';
import FAQ from './FAQ';


export default function Home() {
  const { walletInterface } = useWalletInterface();
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState(1);

  return (
    <Stack alignItems="center" spacing={4}>
      <Hero />
      <br></br>
      <Intro />
      <br></br>
      <Features />
      <br></br>
      <FAQ />
      <br></br>
      <Links />
      {walletInterface !== null && (
        <>
        </>
      )}
    </Stack>
  )
}