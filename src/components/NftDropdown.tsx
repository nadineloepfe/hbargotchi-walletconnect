import { MenuItem, TextField } from "@mui/material";
import { MirrorNodeNftInfo } from "../services/wallets/mirrorNodeClient";

interface NftDropdownProps {
  nfts: MirrorNodeNftInfo[]; 
  selectedTokenId: string;
  onSelect: (tokenId: string) => void;
}

export default function NftDropdown({ nfts, selectedTokenId, onSelect }: NftDropdownProps) {
  return (
    <TextField
      label="Select Hbargotchi NFT"
      value={selectedTokenId}
      select
      onChange={(e) => onSelect(e.target.value)}
      sx={{ width: '250px', height: '50px' }}
    >
      <MenuItem value="">Select a token</MenuItem>
      {nfts.map((nft) => (
        <MenuItem key={nft.token_id} value={nft.token_id}>
          {nft.token_id} (Serial: {nft.serial_number})
        </MenuItem>
      ))}
    </TextField>
  );
}
