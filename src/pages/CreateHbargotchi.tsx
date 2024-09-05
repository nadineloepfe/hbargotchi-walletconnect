import React, { useState } from "react";
import { Button, Typography, Stack } from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import catImage from "../assets/hbargotchi-cat.webp";
import foxImage from "../assets/hbargotchi-fox.webp";
import penguinImage from "../assets/hbargotchi-penguin.webp";
import { TokenCreateTransaction, TokenMintTransaction, PrivateKey, TokenType } from "@hashgraph/sdk";

// Define a type for walletInterface
type WalletInterface = {
  getSigner: () => any;
  getProvider: () => any;
};

export default function CreateHbargotchi({ accountId }: { accountId: string }) {
  const [createTextSt, setCreateTextSt] = useState("");
  const [createLinkSt, setCreateLinkSt] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { walletInterface } = useWalletInterface();

  const confirmNFT = async () => {
    if (!selectedImage) {
      setCreateTextSt("🛑 Please select an image first! 🛑");
      return;
    }

    // Check if walletInterface is null
    if (!walletInterface) {
      setCreateTextSt("❌ Wallet is not connected. Please connect a wallet.");
      return;
    }

    const metadata = getMetadataForImage(selectedImage);
    try {
      const [hbargotchiTokenId, supply, txIdRaw] = await createAndMintHbargotchi(walletInterface, accountId, metadata);
      setCreateTextSt(`Successfully created and minted Hbargotchi NFT with ID: ${hbargotchiTokenId} and total supply: ${supply} ✅`);
      const txId = prettify(txIdRaw);
      setCreateLinkSt(`https://hashscan.io/testnet/transaction/${txId}`);
    } catch (error) {
      if (error instanceof Error) {
        setCreateTextSt("❌ Error minting Hbargotchi: " + error.message);
      } else {
        setCreateTextSt("❌ An unknown error occurred.");
      }
    }
  };

  // Function to mint the NFT using WalletConnect
  const createAndMintHbargotchi = async (
    walletInterface: WalletInterface, 
    accountId: string, 
    metadata: string
  ) => {
    console.log(`- Creating and minting your personal Hbargotchi NFT...`);

    // Use the walletInterface signer
    const signer = walletInterface.getSigner();
    const provider = walletInterface.getProvider();

    const supplyKey = PrivateKey.generate();

    // Create the NFT token on Hedera
    const tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName("Hbargotchi")
      .setTokenSymbol("HBG")
      .setTokenType(TokenType.NonFungibleUnique)
      .setTreasuryAccountId(accountId)
      .setAutoRenewAccountId(accountId)
      .setAutoRenewPeriod(7776000)
      .setSupplyKey(supplyKey.publicKey)
      .freezeWithSigner(signer);

    const tokenCreateSubmit = await tokenCreateTx.executeWithSigner(signer);
    const tokenCreateRx = await provider.getTransactionReceipt(tokenCreateSubmit.transactionId);
    const hbargotchiTokenId = tokenCreateRx.tokenId;

    console.log(`- Created Hbargotchi NFT with ID: ${hbargotchiTokenId}`);
    console.log(`- Supply Key: ${supplyKey}`);

    // Mint the NFT with the selected metadata
    const tokenMintTx = await new TokenMintTransaction()
      .setTokenId(hbargotchiTokenId)
      .addMetadata(Buffer.from(metadata))
      .freezeWithSigner(signer);

    const signedTokenMintTx = await tokenMintTx.sign(supplyKey);
    const tokenMintSubmit = await signedTokenMintTx.executeWithSigner(signer);
    const tokenMintReceipt = await provider.getTransactionReceipt(tokenMintSubmit.transactionId);
    const supply = tokenMintReceipt.totalSupply;

    console.log(`- Hbargotchi NFT minted. New total supply is ${supply}`);
    console.log(`- Transaction ID: ${tokenMintSubmit.transactionId}`);

    return [hbargotchiTokenId.toString(), supply, tokenMintSubmit.transactionId.toString()];
  };

  const getMetadataForImage = (image: string) => {
    switch (image) {
      case "cat":
        return "ipfs://bafybeigpkigz7bw5dbllvjactnaqbls3v5hxl66o5ukzj33ar4irmspe5q";
      case "fox":
        return "ipfs://bafybeiapimahbagjaqsxetdhucsqyttm4brtyqp45ntlhsx7miecgx463y";
      case "penguin":
        return "ipfs://bafybeic4wltfkcmeuw2y2owtfni6mu4tvniys5ooyxm7yzbnqxhecjpuau";
      default:
        return "";
    }
  };

  const selectImage = (image: string) => {
    setSelectedImage(image);
  };

  function prettify(txIdRaw: string) {
    const a = txIdRaw.split("@");
    const b = a[1].split(".");
    return `${a[0]}-${b[0]}-${b[1]}`;
  }

  return (
    <Stack alignItems="center" spacing={4}>
      <Typography variant="h4" color="white">
        Choose your pet
      </Typography>
      <Stack direction="row" spacing={2}>
        <img
          src={catImage}
          alt="Hbargotchi Cat"
          className={`hbargotchi-image ${selectedImage === "cat" ? "selected" : ""}`}
          onClick={() => selectImage("cat")}
          style={{ cursor: "pointer", border: selectedImage === "cat" ? "2px solid blue" : "none" }}
        />
        <img
          src={foxImage}
          alt="Hbargotchi Fox"
          className={`hbargotchi-image ${selectedImage === "fox" ? "selected" : ""}`}
          onClick={() => selectImage("fox")}
          style={{ cursor: "pointer", border: selectedImage === "fox" ? "2px solid blue" : "none" }}
        />
        <img
          src={penguinImage}
          alt="Hbargotchi Penguin"
          className={`hbargotchi-image ${selectedImage === "penguin" ? "selected" : ""}`}
          onClick={() => selectImage("penguin")}
          style={{ cursor: "pointer", border: selectedImage === "penguin" ? "2px solid blue" : "none" }}
        />
      </Stack>
      {selectedImage && (
        <Button
          variant="contained"
          onClick={confirmNFT}
          sx={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}
        >
          Confirm and Mint
        </Button>
      )}
      {createTextSt && <Typography variant="body1" color="green">{createTextSt}</Typography>}
      {createLinkSt && (
        <Button
          variant="contained"
          href={createLinkSt}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          View Transaction
        </Button>
      )}
    </Stack>
  );
}
