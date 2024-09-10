import { useEffect, useState } from "react";
import { fetchHbargotchiNfts } from "../services/tokenService";

const useFetchNfts = (accountId: string | null) => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchNfts = async () => {
      if (accountId) {
        setLoading(true);
        try {
          const fetchedNfts = await fetchHbargotchiNfts(accountId);
          setNfts(fetchedNfts);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchNfts();
  }, [accountId]);

  return { nfts, loading };
};

export default useFetchNfts;
