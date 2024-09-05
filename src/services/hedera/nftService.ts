// services/hedera/nftService.ts

import { TokenCreateTransaction, TokenMintTransaction, PrivateKey, TokenType, TokenId, AccountId } from "@hashgraph/sdk";

// Function to create the NFT and return the token ID and supply key
export async function createHbargotchiNFT(accountId: string, signer: any): Promise<{ tokenId: TokenId | null, supplyKey: PrivateKey | null }> {
  try {
    const supplyKey = PrivateKey.generate();  // Generate the supply key once and use it for both creation and minting

    let tokenCreateTx = new TokenCreateTransaction()
      .setTokenName("Hbargotchi")
      .setTokenSymbol("HBG")
      .setTokenType(TokenType.NonFungibleUnique)
      .setTreasuryAccountId(AccountId.fromString(accountId))
      .setAutoRenewAccountId(AccountId.fromString(accountId))
      .setAutoRenewPeriod(7776000)  // Example: 90 days
      .setSupplyKey(supplyKey.publicKey);

    // Freeze the transaction with the DAppSigner
    tokenCreateTx = await tokenCreateTx.freezeWithSigner(signer);

    // Execute the transaction using the DAppSigner
    const transactionResponse = await tokenCreateTx.executeWithSigner(signer);
    const tokenCreateRx = await signer.getProvider().getTransactionReceipt(transactionResponse.transactionId);
    const hbargotchiTokenId = tokenCreateRx.tokenId;

    console.log(`- Created Hbargotchi NFT with ID: ${hbargotchiTokenId}`);
    console.log(`- Supply Key: ${supplyKey}`);

    return { tokenId: hbargotchiTokenId, supplyKey };
  } catch (error) {
    console.error("Error creating Hbargotchi NFT:", error);
    return { tokenId: null, supplyKey: null };
  }
}

// Function to mint the NFT using the supply key generated during creation
export async function mintHbargotchiNFT(hbargotchiTokenId: TokenId, metadata: string, supplyKey: PrivateKey, signer: any) {
  try {
    let tokenMintTx = new TokenMintTransaction()
      .setTokenId(hbargotchiTokenId)
      .addMetadata(Buffer.from(metadata));

    // Freeze the transaction with the DAppSigner
    tokenMintTx = await tokenMintTx.freezeWithSigner(signer);

    // Execute the transaction using the DAppSigner
    const transactionResponse = await tokenMintTx.executeWithSigner(signer);
    const tokenMintReceipt = await signer.getProvider().getTransactionReceipt(transactionResponse.transactionId);
    const supply = tokenMintReceipt.totalSupply;

    console.log(`- Hbargotchi NFT minted. New total supply is ${supply}`);
    console.log(`- Transaction ID: ${transactionResponse.transactionId}`);

    return transactionResponse.transactionId;
  } catch (error) {
    console.error("Error minting Hbargotchi NFT:", error);
    return null;
  }
}
