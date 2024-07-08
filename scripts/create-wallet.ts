import { Keypair } from "@solana/web3.js";
import fs from "fs";

const wallet = Keypair.generate();
console.log(`Wallet Account: https://explorer.solana.com/address/${wallet.publicKey.toBase58()}?cluster=devnet}`)
fs.writeFileSync("wallets/wallet.json", JSON.stringify([...wallet.secretKey]));