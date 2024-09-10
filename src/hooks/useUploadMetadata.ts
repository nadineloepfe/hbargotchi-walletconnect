import { useState } from "react";
import { uploadJsonToPinata } from "../services/ipfsService";

const useUploadMetadata = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMetadata = async (metadata: any) => {
    setUploading(true);
    try {
      const ipfsHash = await uploadJsonToPinata(metadata);
      return ipfsHash;
    } catch (error) {
      console.error("Error uploading metadata to Pinata:", error);
      setError("Failed to upload metadata");
    } finally {
      setUploading(false);
    }
  };

  return { uploadMetadata, uploading, error };
};

export default useUploadMetadata;
