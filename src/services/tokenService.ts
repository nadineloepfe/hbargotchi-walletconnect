import { AccountId } from "@hashgraph/sdk";
import { MirrorNodeClient, MirrorNodeAccountTokenBalanceWithInfo, MirrorNodeNftInfo, MirrorNodeTokenInfo } from "./wallets/mirrorNodeClient";
import { appConfig } from "../config";

export const fetchHbargotchiNfts = async (accountId: string): Promise<MirrorNodeNftInfo[]> => {
  const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
  const nftInfos = await mirrorNodeClient.getNftInfo(AccountId.fromString(accountId));

  const hbargotchiNftsFiltered: MirrorNodeNftInfo[] = [];
  for (const nft of nftInfos) {
    const tokenInfo: MirrorNodeTokenInfo = await mirrorNodeClient.getTokenInfo(nft.token_id);
    if (tokenInfo.symbol === "HBG") {
      hbargotchiNftsFiltered.push(nft);
    }
  }

  return hbargotchiNftsFiltered;
};

export const fetchNftMetadata = async (tokenId: string, serialNumber: number): Promise<any> => {
  const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
  const nftDetails = await mirrorNodeClient.getNftDetails(tokenId, serialNumber);
  const metadataBase64 = nftDetails.metadata;

  if (metadataBase64) {
    const decodedMetadata = atob(metadataBase64);
    if (decodedMetadata.startsWith("ipfs://")) {
      const ipfsUrl = decodedMetadata.replace("ipfs://", "https://ipfs.io/ipfs/");
      const response = await fetch(ipfsUrl);
      return await response.json();
    } else {
      throw new Error("Invalid IPFS URL");
    }
  } else {
    throw new Error("No metadata available");
  }
};

export const fetchTokenBalances = async (accountId: string): Promise<MirrorNodeAccountTokenBalanceWithInfo[]> => {
  const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
  const tokens = await mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(AccountId.fromString(accountId));
  return tokens.filter((token) => token.info.symbol === "HBG");  // Filter for Hbargotchi tokens
};

export const checkTokenAssociation = async (accountId: string, tokenId: string): Promise<boolean> => {
  const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
  return await mirrorNodeClient.isAssociated(AccountId.fromString(accountId), tokenId);
};
