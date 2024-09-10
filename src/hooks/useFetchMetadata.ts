import { useState, useEffect } from "react";
import { fetchNftMetadata } from "../services/tokenService";

const useFetchMetadata = (tokenId: string | null, serialNumber: number | null) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenId && serialNumber !== null) {
        setLoading(true);
        try {
          const data = await fetchNftMetadata(tokenId, serialNumber);
          setMetadata(data);
        } catch (error) {
          console.error("Error fetching metadata:", error);
          setError("Failed to fetch metadata");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMetadata();
  }, [tokenId, serialNumber]);

  return { metadata, loading, error };
};

export default useFetchMetadata;
