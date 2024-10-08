import { WalletConnectContext } from "../../../contexts/WalletConnectContext";
import { useCallback, useContext, useEffect } from 'react';
import { WalletInterface } from "../walletInterface";
import { AccountId, ContractExecuteTransaction, TokenUpdateNftsTransaction, TokenInfoQuery, TopicMessageSubmitTransaction, ContractId, TopicId, LedgerId, PrivateKey, TokenType, TokenAssociateTransaction, TokenId, Transaction, TransactionId, TransferTransaction, TokenCreateTransaction, TokenMintTransaction, Client } from "@hashgraph/sdk";
import { ContractFunctionParameterBuilder } from "../contractFunctionParameterBuilder";
import { appConfig } from "../../../config";
import { SignClientTypes } from "@walletconnect/types";
import { DAppConnector, HederaJsonRpcMethod, HederaSessionEvent, HederaChainId, SignAndExecuteTransactionParams, transactionToBase64String } from "@hashgraph/hedera-wallet-connect";
import EventEmitter from "events";
import { db } from '../../../firebaseConfig'; 
import firebase from 'firebase/app'; 
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 

// Created refreshEvent because `dappConnector.walletConnectClient.on(eventName, syncWithWalletConnectContext)` would not call syncWithWalletConnectContext
// Reference usage from walletconnect implementation https://github.com/hashgraph/hedera-wallet-connect/blob/main/src/lib/dapp/index.ts#L120C1-L124C9
const refreshEvent = new EventEmitter();

// Create a new project in walletconnect cloud to generate a project id
const walletConnectProjectId = process.env.REACT_APP_WALLETCONNECT_ID!;
const currentNetworkConfig = appConfig.networks.testnet;
const hederaNetwork = currentNetworkConfig.network;
const hederaClient = Client.forName(hederaNetwork);
const topicId = TopicId.fromString(process.env.REACT_APP_TOPIC_ID!);

// Adapted from walletconnect dapp example:
// https://github.com/hashgraph/hedera-wallet-connect/blob/main/src/examples/typescript/dapp/main.ts#L87C1-L101C4
const metadata: SignClientTypes.Metadata = {
  name: "Hbargotchi",
  description: "Hbargotchi",
  url: window.location.origin,
  icons: [window.location.origin + "/logo192.png"],
}
const dappConnector = new DAppConnector(
  metadata,
  LedgerId.fromString(hederaNetwork),
  walletConnectProjectId,
  Object.values(HederaJsonRpcMethod),
  [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
  [HederaChainId.Testnet],
);

// ensure walletconnect is initialized only once
let walletConnectInitPromise: Promise<void> | undefined = undefined;
const initializeWalletConnect = async () => {
  if (walletConnectInitPromise === undefined) {
    walletConnectInitPromise = dappConnector.init();
  }
  await walletConnectInitPromise;
};

export const openWalletConnectModal = async () => {
  await initializeWalletConnect();
  await dappConnector.openModal().then((x) => {
    refreshEvent.emit("sync");
  });
};

class WalletConnectWallet implements WalletInterface {
  private getSigner() {
    if (dappConnector.signers.length === 0) {
      throw new Error('No signers found!');
    }
    return dappConnector.signers[0];
  }

  private getAccountId() {
    // Need to convert from walletconnect's AccountId to hashgraph/sdk's AccountId because walletconnect's AccountId and hashgraph/sdk's AccountId are not the same!
    return AccountId.fromString(this.getSigner().getAccountId().toString());
  }

  async transferHBAR(toAddress: AccountId, amount: number) {
    const transferHBARTransaction = new TransferTransaction()
      .addHbarTransfer(this.getAccountId(), -amount)
      .addHbarTransfer(toAddress, amount);

    const signer = this.getSigner();
    await transferHBARTransaction.freezeWithSigner(signer);
    const txResult = await transferHBARTransaction.executeWithSigner(signer);
    return txResult ? txResult.transactionId : null;
  }

  async transferFungibleToken(toAddress: AccountId, tokenId: TokenId, amount: number) {
    const transferTokenTransaction = new TransferTransaction()
      .addTokenTransfer(tokenId, this.getAccountId(), -amount)
      .addTokenTransfer(tokenId, toAddress.toString(), amount);

    const signer = this.getSigner();
    await transferTokenTransaction.freezeWithSigner(signer);
    const txResult = await transferTokenTransaction.executeWithSigner(signer);

    // Log the transfer event to the Hedera Consensus Service
    const message = `${amount} of $FOOD Token transferred from ${this.getAccountId()} to ${toAddress.toString()}`;
    const interactionHash = await this.sendMessage(topicId, message);
    console.log(`- Interaction logged to HCS. Message hash: ${interactionHash}`);

    return txResult ? txResult.transactionId : null;
  }

  async transferNonFungibleToken(toAddress: AccountId, tokenId: TokenId, serialNumber: number) {
    const transferTokenTransaction = new TransferTransaction()
      .addNftTransfer(tokenId, serialNumber, this.getAccountId(), toAddress);

    const signer = this.getSigner();
    await transferTokenTransaction.freezeWithSigner(signer);
    const txResult = await transferTokenTransaction.executeWithSigner(signer);

    // Log the transfer event to the Hedera Consensus Service
    const message = `Hbargotchi with ID ${tokenId} transferred from ${this.getAccountId()} to ${toAddress.toString()}`;
    const interactionHash = await this.sendMessage(topicId, message);
    console.log(`- Interaction logged to HCS. Message hash: ${interactionHash}`);

    return txResult ? txResult.transactionId : null;
  }

  async associateToken(tokenId: TokenId) {
    const associateTokenTransaction = new TokenAssociateTransaction()
      .setAccountId(this.getAccountId())
      .setTokenIds([tokenId]);

    const signer = this.getSigner();
    await associateTokenTransaction.freezeWithSigner(signer);
    const txResult = await associateTokenTransaction.executeWithSigner(signer);
    console.log(`Associated user with token ${tokenId}`);

    // Log the transfer event to the Hedera Consensus Service
    const message = `${this.getAccountId()} associated with ${tokenId} Token! Welcome to the club!`;
    const interactionHash = await this.sendMessage(topicId, message);
    console.log(`- Interaction logged to HCS. Message hash: ${interactionHash}`);

    return txResult ? txResult.transactionId : null;
  }

  async sendMessage(topicId: TopicId, message: string) {
    const topicMessageTransaction = new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message);
  
    const signer = this.getSigner();
    await topicMessageTransaction.freezeWithSigner(signer);
    const txResult = await topicMessageTransaction.executeWithSigner(signer);
    return txResult ? txResult.transactionId : null;
  }

  async createNFT() {
    const supplyKey = PrivateKey.generate(); 
    const metadataKey = PrivateKey.generate(); 
    const signer = this.getSigner();
    const tokenCreateTx = new TokenCreateTransaction()
      .setTokenName("Hbargotchi")
      .setTokenSymbol("HBG")
      .setTokenType(TokenType.NonFungibleUnique)
      .setTreasuryAccountId(this.getAccountId())
      .setAutoRenewAccountId(this.getAccountId())
      .setAutoRenewPeriod(7776000)
      .setSupplyKey(supplyKey.publicKey)
      .setMetadataKey(metadataKey.publicKey)
      .setTransactionId(TransactionId.generate(this.getAccountId()));

      const txResult = await tokenCreateTx.executeWithSigner(signer);
      const nftCreateRx = await txResult.getReceipt(hederaClient);
      const tokenId = nftCreateRx.tokenId;

      // Log the NFT create event to the Hedera Consensus Service
      const message = `NFT created with tokenId ${tokenId}`;
      const interactionHash = await this.sendMessage(topicId, message);
      console.log(`- Interaction logged to HCS. Message hash: ${interactionHash}`);

      console.log("NFT created! Token Id" + tokenId)
      console.log("MetadataKey:" + metadataKey)

      if (tokenId) {
      await setDoc(doc(db, 'nft-keys', tokenId.toString()), {
        tokenId: tokenId.toString(),
        metadataKey: metadataKey.toString(),
        supplyKey: supplyKey.toString(),
        createdAt: serverTimestamp(), 
      });
      }

      return { tokenId, supplyKey };
  }


  async mintFoodTokens(tokenId: TokenId | string, amount: number, supplyKey: PrivateKey) {
    const tokenMintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setAmount(amount)
      .setTransactionId(TransactionId.generate(this.getAccountId()))
      .freezeWith(hederaClient);
  
    const signer = this.getSigner();
    // await tokenMintTx.freezeWithSigner(signer);
    const signedTokenMintTx = await tokenMintTx.sign(supplyKey);
    console.log("NFT signed!")
    const txResult = await signedTokenMintTx.executeWithSigner(signer);
    console.log(`Minted ${amount} $FOOD tokens.`);
    return txResult ? txResult.transactionId : null;
  }
  

  async mintNFT(tokenId: TokenId | string, metadata: string, supplyKey: PrivateKey) {
    const metadataBytes = new TextEncoder().encode(metadata);
    const signer = this.getSigner();
    const tokenMintTx = await new TokenMintTransaction()
      .setTokenId(tokenId)
      .addMetadata(metadataBytes) 
      .setTransactionId(TransactionId.generate(this.getAccountId()))
      .freezeWith(hederaClient);

    console.log("Signing NFT with SupplyKey....")
    const signedTokenMintTx = await tokenMintTx.sign(supplyKey);
    console.log("NFT signed!")

    const txResult = await signedTokenMintTx.executeWithSigner(signer);
    const nftMintRx = await txResult.getReceipt(hederaClient);
    const supply = nftMintRx.totalSupply;
    console.log(`- Hbargotchi NFT minted with TokenId: ${tokenId}. New total supply is ${supply}`);

      // Log the NFT minting event to the Hedera Consensus Service
    const message = `NFT minted with tokenId ${tokenId} and metadata ${metadata}`;
    const interactionHash = await this.sendMessage(topicId, message);
    console.log(`- Interaction logged to HCS. Message hash: ${interactionHash}`);

    return txResult ? txResult.transactionId : null;
  }
  

  async updateNftMetadata(tokenId: TokenId | string, serialNumber: number, newMetadataUri: string, metadataKey: PrivateKey) {
      const signer = this.getSigner();
  
      const updateTransaction = new TokenUpdateNftsTransaction()
        .setTokenId(tokenId)
        .setSerialNumbers([serialNumber])
        .setMetadata(new TextEncoder().encode(newMetadataUri))
        .freezeWith(hederaClient);
      
      console.log("signing transaction with Metadata Key");
      const signedUpdateTx = await updateTransaction.sign(metadataKey);
  
      console.log("Executing with signer");
      const txResult = await signedUpdateTx.executeWithSigner(signer);
      console.log("Transaction executed:", txResult);
  
      console.log(`Successfully updated metadata for NFT ${serialNumber} of token ${tokenId}`);
      return txResult ? txResult.transactionId : null;
  }
  
  async fetchTokenInfo(tokenId: string) {
    const tokenInfoQuery = new TokenInfoQuery()
      .setTokenId(TokenId.fromString(tokenId));

    const signer = this.getSigner();
    const txResult = await tokenInfoQuery.executeWithSigner(signer);

    if (txResult?.metadata) {
      const decodedMetadata = new TextDecoder().decode(txResult.metadata);
      console.log(decodedMetadata)
      return decodedMetadata;
    } else {
      console.log("No metadata available for this token.");
      return null;
    }
  }
  
  // Purpose: build contract execute transaction and send to wallet for signing and execution
  // Returns: Promise<TransactionId | null>
  async executeContractFunction(contractId: ContractId, functionName: string, functionParameters: ContractFunctionParameterBuilder, gasLimit: number) {
    const tx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(gasLimit)
      .setFunction(functionName, functionParameters.buildHAPIParams());

    const signer = this.getSigner();
    await tx.freezeWithSigner(signer);
    const txResult = await tx.executeWithSigner(signer);

    // in order to read the contract call results, you will need to query the contract call's results form a mirror node using the transaction id
    // after getting the contract call results, use ethers and abi.decode to decode the call_result
    return txResult ? txResult.transactionId : null;
  }
  disconnect() {
    dappConnector.disconnectAll().then(() => {
      refreshEvent.emit("sync");
    });
  }
};
export const walletConnectWallet = new WalletConnectWallet();

// this component will sync the walletconnect state with the context
export const WalletConnectClient = () => {
  // use the HashpackContext to keep track of the hashpack account and connection
  const { setAccountId, setIsConnected } = useContext(WalletConnectContext);

  // sync the walletconnect state with the context
  const syncWithWalletConnectContext = useCallback(() => {
    const accountId = dappConnector.signers[0]?.getAccountId()?.toString();
    if (accountId) {
      setAccountId(accountId);
      setIsConnected(true);
    } else {
      setAccountId('');
      setIsConnected(false);
    }
  }, [setAccountId, setIsConnected]);

  useEffect(() => {
    // Sync after walletconnect finishes initializing
    refreshEvent.addListener("sync", syncWithWalletConnectContext);

    initializeWalletConnect().then(() => {
      syncWithWalletConnectContext();
    });

    return () => {
      refreshEvent.removeListener("sync", syncWithWalletConnectContext);
    }
  }, [syncWithWalletConnectContext]);
  return null;
};
