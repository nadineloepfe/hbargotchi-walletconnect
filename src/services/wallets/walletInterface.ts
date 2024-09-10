import { AccountId, ContractId, TokenId, TopicId, PrivateKey, TransactionId } from "@hashgraph/sdk";
import { ContractFunctionParameterBuilder } from "./contractFunctionParameterBuilder";

export interface WalletInterface {
  executeContractFunction: (contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) => Promise<TransactionId | string | null>;
  disconnect: () => void;
  transferHBAR: (toAddress: AccountId, amount: number) => Promise<TransactionId | string | null>;
  transferFungibleToken: (toAddress: AccountId, tokenId: TokenId, amount: number) => Promise<TransactionId | string | null>;
  transferNonFungibleToken: (toAddress: AccountId, tokenId: TokenId, serialNumber: number) => Promise<TransactionId | string | null>;
  associateToken: (tokenId: TokenId) => Promise<TransactionId | string | null>;
  createNFT: () => Promise<{ tokenId: TokenId | string | null; supplyKey: PrivateKey }>;
  mintNFT: (tokenId: TokenId | string, metadata: string, supplyKey: PrivateKey)  => Promise<TransactionId | string | null>;
  sendMessage: (topicId: TopicId, message: string) => Promise<TransactionId | string | null>;
  mintFoodTokens: (tokenId: TokenId | string, amount: number, supplyKey: PrivateKey)  => Promise<TransactionId | string | null>;
}