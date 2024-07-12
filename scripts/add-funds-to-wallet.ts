import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import payerWalletSecretKey from "../wallets/payer-secret-key.json";

const wallet = Keypair.fromSecretKey(new Uint8Array(payerWalletSecretKey)); // FIXME: is wallet.publicKey different deriving it from the secretKey?
const connection = new Connection("https://api.devnet.solana.com", "finalized");

(async () => {
    try {
        const airdropSignature = await connection.requestAirdrop(
            wallet.publicKey,
            1 * LAMPORTS_PER_SOL
        );
        console.log(`Airdrop transaction: https://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`);
    } catch (error) {
        console.error(error);
    }
})();