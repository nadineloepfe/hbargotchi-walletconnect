import React, { useState } from "react";
import { Button, Typography, Stack } from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import catImage from "../assets/hbargotchi-cat.webp";
import foxImage from "../assets/hbargotchi-fox.webp";
import penguinImage from "../assets/hbargotchi-penguin.webp";
import { TokenId, PrivateKey } from "@hashgraph/sdk";
import "./CreateHbargotchi.css";

export default function CreateHbargotchi() {
  const [createTextSt, setCreateTextSt] = useState("");
  const [createLinkSt, setCreateLinkSt] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { walletInterface } = useWalletInterface();

  const confirmNFT = async () => {
    if (!selectedImage) {
      setCreateTextSt("🛑 Please select an image first! 🛑");
      return;
    }

    if (!walletInterface) {
      setCreateTextSt("❌ No wallet connected.");
      return;
    }

    const metadata = getMetadataForImage(selectedImage);

    try {
      // First, create the NFT and get the tokenId
      console.log("Creating NFT...");
      const { tokenId, supplyKey } = await walletInterface.createNFT();
      console.log("supplyKey: " + supplyKey)
      console.log("NFT created with tokenId:", tokenId?.toString());

      if (tokenId) {
        setCreateTextSt(`NFT created with tokenId: ${tokenId.toString()}`);

        // Mint the NFT using the returned tokenId
        const mintTxId = await walletInterface.mintNFT(tokenId, metadata, supplyKey);
        setCreateTextSt(`Successfully minted Hbargotchi NFT! Token ID: ${tokenId}`);
        setCreateLinkSt(`https://hashscan.io/testnet/transaction/${mintTxId}`);
      } else {
        setCreateTextSt("❌ Failed to create NFT.");
      }
    } catch (error: any) {
      setCreateTextSt(`❌ Error during NFT creation: ${error.message}`);
      console.error("Error during NFT creation:", error);
    }
  };

  // Function to retrieve metadata based on the selected image
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

  // Set the selected image on click
  const selectImage = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <Stack alignItems="center" spacing={10}>
      <Typography variant="h4" color="white">
        Choose your pet
      </Typography>
      <Stack direction="row" spacing={7}>
        <img
          src={catImage}
          alt="Hbargotchi Cat"
          className={`hbargotchi-image ${selectedImage === "cat" ? "selected" : ""}`}
          onClick={() => selectImage("cat")}
          style={{ cursor: "pointer" }}
        />
        <img
          src={foxImage}
          alt="Hbargotchi Fox"
          className={`hbargotchi-image ${selectedImage === "fox" ? "selected" : ""}`}
          onClick={() => selectImage("fox")}
          style={{ cursor: "pointer" }}
        />
        <img
          src={penguinImage}
          alt="Hbargotchi Penguin"
          className={`hbargotchi-image ${selectedImage === "penguin" ? "selected" : ""}`}
          onClick={() => selectImage("penguin")}
          style={{ cursor: "pointer" }}
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
