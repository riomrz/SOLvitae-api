import { createAccount, createMintToInstruction, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import walletSecretKey from "../wallets/payer-secret-key.json";
import mintSecretKey from "../wallets/mint-secret-key.json";


(async () => {
    //********* Mint 1 Token *********//
    
    const payer = Keypair.fromSecretKey(new Uint8Array(walletSecretKey));
    
    // Connection to devnet cluster
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    
    // Retrieve keypair for Mint Account
    const mintKeypair = Keypair.fromSecretKey(new Uint8Array(mintSecretKey));
    // Address for Mint Account
    const mint = mintKeypair.publicKey;
    
    const mintAuthority = new PublicKey("2iUdCpbbTBAWLBMvThkExLR72c2FpiYPuBJkDphFyErN")
    
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
    
    // Instruction to mint a single unit of the token
    const initializeMintToInstruction = createMintToInstruction(
        mint, // mint address
        tokenAccount, // destination
        mintAuthority, // mint authority
        1, // amount: 1 for a NFT
        [],
        TOKEN_2022_PROGRAM_ID
    );
    
    // Create and send transaction
    const transaction = new Transaction().add(
        initializeMintToInstruction
    )
    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [ payer ], // Signers
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