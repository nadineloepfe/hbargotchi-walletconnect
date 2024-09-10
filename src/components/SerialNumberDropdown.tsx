import { MenuItem, TextField } from "@mui/material";
import { MirrorNodeNftInfo } from "../services/wallets/mirrorNodeClient";

interface SerialNumberDropdownProps {
  nfts: MirrorNodeNftInfo[]; 
  selectedTokenId: string;
  selectedSerialNumber: number | string;
  onSelect: (serialNumber: number) => void;
}

export default function SerialNumberDropdown({
  nfts,
  selectedTokenId,
  selectedSerialNumber,
  onSelect,
}: SerialNumberDropdownProps) {
  const selectedNft = nfts.find((nft) => nft.token_id === selectedTokenId);

  return (
    <TextField
      label="Select Serial Number"
      value={selectedSerialNumber ?? ""}
      select
      onChange={(e) => onSelect(Number(e.target.value))}
      sx={{ width: '190px', height: '50px' }}
    >
      <MenuItem value={-1}>Select a Serial Number</MenuItem>
      {selectedNft && (
        <MenuItem value={selectedNft.serial_number}>
          {selectedNft.serial_number}
        </MenuItem>
      )}
    </TextField>
  );
}
