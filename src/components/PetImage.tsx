import React from "react";
import { Box } from "@mui/material";

interface PetImageProps {
  src: string;
  alt: string;
  selected: boolean;
  onSelect: () => void;
}

const PetImage: React.FC<PetImageProps> = ({ src, alt, selected, onSelect }) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      className={`hbargotchi-image ${selected ? "selected" : ""}`}
      onClick={onSelect}
    />
  );
};

export default PetImage;
