import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import walletSecretKey from "../wallets/wallet.json";

const wallet = Keypair.fromSecretKey(new Uint8Array(walletSecretKey)); // FIXME: is wallet.publicKey different deriving it from the secretKey?
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