import {
  Connection,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import {
  createMint,
  createAccount,
  TOKEN_2022_PROGRAM_ID,
  createMintToInstruction,
} from "@solana/spl-token";
import walletSecretKey from "../wallets/payer-secret-key.json";

(async () => {
  const payer = Keypair.fromSecretKey(new Uint8Array(walletSecretKey));
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
  // Create new Mint Account
  const mint = await createMint(
    connection,
    payer, // payer
    payer.publicKey, // mint authority
    payer.publicKey, // freeze authority
    2, // decimals
    new Keypair(), // keypair for mint account
    null,
    TOKEN_2022_PROGRAM_ID
  );
  
  // Create new Token Account, defaults to ATA
  const tokenAccount = await createAccount(
    connection,
    payer, // payer
    mint, // mint address
    payer.publicKey, // token account owner
    null,
    null,
    TOKEN_2022_PROGRAM_ID
  );
  
  const instruction = createMintToInstruction(
    mint, // mint address
    tokenAccount, // destination
    payer.publicKey, // mint authority
    1, // amount
    [],
    TOKEN_2022_PROGRAM_ID
  );
  
  const transaction = new Transaction().add(instruction);
  
  // Sign and send transaction
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [
      payer, // payer, mint authority
    ]
  );
  
  console.log(
    "\nTransaction Signature:",
    `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
  
  console.log(
    "\nToken Account: ",
    `https://explorer.solana.com/address/${tokenAccount}?cluster=devnet`
  );
})()
