import React, { useState } from "react";
import { Button, Typography, Stack } from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { metadataMap } from "../constants/metadataMap"; 
import PetImage from "../components/PetImage"; 
import frogImage from "../assets/hbg-frog.webp";
import squirrelImage from "../assets/hbg-squirrel.webp";
import elephantImage from "../assets/hbg-elephant.webp";
import catImage from "../assets/hbargotchi-cat.webp";
import foxImage from "../assets/hbargotchi-fox.webp";
import penguinImage from "../assets/hbargotchi-penguin.webp";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Adopt.css"; 

export default function Adopt() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { walletInterface } = useWalletInterface();

  const confirmNFT = async () => {
    if (!selectedImage) {
      toast.error("Please select an image!");
      return;
    }

    if (!walletInterface) {
      toast.error("No wallet connected.");
      return;
    }

    const metadata = metadataMap[selectedImage];

    try {
      toast.info("Creating NFT...");

      const { tokenId, supplyKey } = await walletInterface.createNFT();
      console.log("NFT created with tokenId:", tokenId?.toString());

      if (tokenId) {
        const mintTxId = await walletInterface.mintNFT(tokenId, metadata, supplyKey);
        toast.success(`Successfully minted Hbargotchi NFT! Token ID: ${tokenId}`);
        toast.info(`View Transaction: https://hashscan.io/testnet/transaction/${mintTxId}`, {
          autoClose: 10000,
          closeOnClick: true,
          onClick: () => window.open(`https://hashscan.io/testnet/transaction/${mintTxId}`, '_blank')
        });
      } else {
        toast.error("Failed to create NFT.");
      }
    } catch (error: any) {
      toast.error(`Error during NFT creation: ${error.message}`);
      console.error("Error during NFT creation:", error);
    }
  };

  const petImages = [
    { src: frogImage, name: "frog" },
    { src: squirrelImage, name: "squirrel" },
    { src: elephantImage, name: "elephant" },
    { src: catImage, name: "cat" },
    { src: foxImage, name: "fox" },
    { src: penguinImage, name: "penguin" }
  ];

  return (
    <Stack alignItems="center" spacing={5}>
      <ToastContainer /> {/* Toast container for notifications */}

      <Typography variant="h4" color="white">
        Choose your pet
      </Typography>

      <div className="hbargotchi-images">
        {petImages.slice(0, 3).map(pet => (
          <PetImage
            key={pet.name}
            src={pet.src}
            alt={`Hbargotchi ${pet.name}`}
            selected={selectedImage === pet.name}
            onSelect={() => setSelectedImage(pet.name)}
          />
        ))}
      </div>

      <div className="hbargotchi-images">
        {petImages.slice(3).map(pet => (
          <PetImage
            key={pet.name}
            src={pet.src}
            alt={`Hbargotchi ${pet.name}`}
            selected={selectedImage === pet.name}
            onSelect={() => setSelectedImage(pet.name)}
          />
        ))}
      </div>

      {selectedImage && (
        <Button
          variant="contained"
          onClick={confirmNFT}
          className="confirm-button"
          sx={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)' }}
        >
          Confirm and Mint
        </Button>
      )}
    </Stack>
  );
}
