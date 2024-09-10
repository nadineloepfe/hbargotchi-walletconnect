import React, { useState } from "react";
import { Button, Typography, Stack } from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import catImage from "../assets/hbargotchi-cat.webp";
import foxImage from "../assets/hbargotchi-fox.webp";
import penguinImage from "../assets/hbargotchi-penguin.webp";
import frogImage from "../assets/hbg-frog.webp";
import squirrelImage from "../assets/hbg-squirrel.webp";
import elephantImage from "../assets/hbg-elephant.webp";
import { TokenId, PrivateKey } from "@hashgraph/sdk";
import "./Adopt.css";

export default function Adopt() {
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
      // Create
      console.log("Creating NFT...");
      const { tokenId, supplyKey } = await walletInterface.createNFT();
      console.log("supplyKey: " + supplyKey)
      console.log("NFT created with tokenId:", tokenId?.toString());

      // const tokenId = TokenId.fromString("0.0.4840057")
      // const supplyKey = PrivateKey.fromString("302e020100300506032b6570042204200f05d7d57e9243ab01965549328c5e772162fad831ffb034e9801390f06bc5f8")
      if (tokenId) {
      //   setCreateTextSt(`NFT created with tokenId: ${tokenId.toString()}`);

        // Mint 
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

  // Function to retrieve metadata 
  const getMetadataForImage = (image: string) => {
    switch (image) {
      case "cat":
        return "ipfs://bafkreiapag7464vfpft4w2pp67asukhbs7rc7w2hhbuk3vchqu5pku6rkm";
      case "fox":
        return "ipfs://bafybeiapimahbagjaqsxetdhucsqyttm4brtyqp45ntlhsx7miecgx463y";
      case "penguin":
        return "ipfs://bafybeic4wltfkcmeuw2y2owtfni6mu4tvniys5ooyxm7yzbnqxhecjpuau";
      case "frog":
        return "ipfs://QmaFrP2gsP5ZWhuf3EspV9YZvS7G3MSj5bKcenNd9d3TEi";
      default:
        return "";
    }
  };

  const selectImage = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <Stack alignItems="center" spacing={5}>
      <Typography variant="h4" color="white">
        Choose your pet
      </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={7}>
      <img
        src={frogImage}
        alt="Hbargotchi Frog"
        className={`hbargotchi-image ${selectedImage === "frog" ? "selected" : ""}`}
        onClick={() => selectImage("frog")}
        style={{ cursor: "pointer" }}
      />
      <img
        src={squirrelImage}
        alt="Hbargotchi Squirrel"
        className={`hbargotchi-image ${selectedImage === "squirrel" ? "selected" : ""}`}
        onClick={() => selectImage("squirrel")}
        style={{ cursor: "pointer" }}
      />
      <img
        src={elephantImage}
        alt="Hbargotchi Elephant"
        className={`hbargotchi-image ${selectedImage === "elephant" ? "selected" : ""}`}
        onClick={() => selectImage("elephant")}
        style={{ cursor: "pointer" }}
      />
    </Stack>

      {/* Second row of images */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={7}>
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