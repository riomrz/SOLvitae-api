import { createMintToInstruction, getOrCreateAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import mintSecretKey from "../wallets/mint-secret-key.json";
import walletSecretKey from "../wallets/payer-secret-key.json";


(async () => {    
    const payer = Keypair.fromSecretKey(new Uint8Array(walletSecretKey));
    
    // Connection to devnet cluster
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    
    // Retrieve keypair for Mint Account
    const mintKeypair = Keypair.fromSecretKey(new Uint8Array(mintSecretKey));
    // Address for Mint Account
    const mint = mintKeypair.publicKey;
    
    const mintAuthority = payer.publicKey;
    
    // Create new Token Account, defaults to ATA
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer, // payer
        mint, // mint address
        payer.publicKey, // token account owner
        null,
        null,
        null,
        TOKEN_2022_PROGRAM_ID // SPL Token program account (needed to add metadata)
    );
    // Token account already created: GmFhtc4qBvJVxTXNP45SJEGPoUyzcFcJRp2Ru4ZzUWh9
    
    // Instruction to mint a single unit of the token
    const initializeMintToInstruction = createMintToInstruction(
        mint, // mint address
        tokenAccount.address, // destination
        mintAuthority, // mint authority
        1, // amount: 1 for a NFT
        [],
        TOKEN_2022_PROGRAM_ID
    );
    
    // Create and send transaction
    const transaction = new Transaction().add(
        initializeMintToInstruction,
        //initializeSetAuthorityInstruction
    )
    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [ payer ], // Signers
    );
    
    console.log(
        "\nTransaction Signature:",
        `https://solana.fm/tx/${transactionSignature}?cluster=devnet`
    );
    // Last test, SOLVITAE tx signature:
    // Transaction Signature: https://solana.fm/tx/418HMK9oNavdpnQP8W8QfwqCrofyXE5nWXamP9mQSy8BmXXrxXkUk863HvokCpkMnJ6XRzLoEBNCoHpNvYsrKkGs?cluster=devnet
    
    console.log(
        "\nToken Account: ",
        `https://solana.fm/address/${tokenAccount.address}?cluster=devnet`
    );
    // Last test, SOLVITAE Token Account:
    // Token Account:  https://solana.fm/address/ER6krr9s3h9zt33bAchR3mQXry31cZVQwsnXfDYHu64w?cluster=devnet
})()