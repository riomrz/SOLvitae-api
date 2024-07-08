import {
  createAccount,
  createMint,
  createMintToInstruction,
  TOKEN_2022_PROGRAM_ID
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction
} from "@solana/web3.js";


const wallet = new Keypair();
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Add credit to payer wallet
const airdropSignature = await connection.requestAirdrop(
  wallet.publicKey,
  1 * LAMPORTS_PER_SOL
);
console.log(`Airdrop transaction: https://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`);

// Create new Mint Account
const mint = await createMint(
  connection,
  wallet, // payer
  wallet.publicKey, // mint authority
  wallet.publicKey, // freeze authority
  2, // decimals
  new Keypair(), // keypair for mint account
  undefined,
  TOKEN_2022_PROGRAM_ID
);

// Create new Token Account, defaults to ATA (Associated Token Account)
const tokenAccount = await createAccount(
  connection,
  wallet, // payer
  mint, // mint address
  wallet.publicKey, // token account owner
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID
);

const instruction = createMintToInstruction(
  mint, // mint address
  tokenAccount, // destination
  wallet.publicKey, // mint authority
  1, // amount: 1 for a NFT
  [],
  TOKEN_2022_PROGRAM_ID
);

const transaction = new Transaction().add(instruction);

// Sign and send transaction
const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [
    wallet, // payer, mint authority
  ]
);

// TODO: freeze Mint Account

console.log(
  "\nTransaction Signature:",
  `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
);

console.log(
  "\nToken Account: ",
  `https://explorer.solana.com/address/${tokenAccount}?cluster=devnet`
);      