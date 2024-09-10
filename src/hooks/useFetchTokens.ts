import { useState, useEffect } from "react";
import { MirrorNodeAccountTokenBalanceWithInfo, MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { AccountId } from "@hashgraph/sdk";
import { appConfig } from "../config";

export const useFetchTokens = (accountId: string | null) => {
  const [availableTokens, setAvailableTokens] = useState<MirrorNodeAccountTokenBalanceWithInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;

    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);

    const fetchTokens = async () => {
      try {
        const tokens = await mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(AccountId.fromString(accountId));
        const hbargotchiTokens = tokens.filter((token) => token.info.symbol === "HBG");
        setAvailableTokens(hbargotchiTokens);
      } catch (err) {
        setError("Failed to fetch tokens.");
      }
    };

    fetchTokens();
  }, [accountId]);

  return { availableTokens, error };
};
