import { AuthorityType, createMint, createSetAuthorityInstruction, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import walletSecretKey from "../wallets/payer-secret-key.json";


(async () => {
    // Get wallet previously funded
    const wallet = Keypair.fromSecretKey(new Uint8Array(walletSecretKey));
    
    // Connection to devnet cluster
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    
    // Create the token type with zero decimal place
    const mint = await createMint(
        connection,
        wallet,
        wallet.publicKey,
        wallet.publicKey,
        0
    );
    
    // Create an account to hold tokens of this new type
    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mint,
        wallet.publicKey
    );
    
    // Mint only one token into the account
    await mintTo(
        connection,
        wallet,
        mint,
        associatedTokenAccount.address,
        wallet,
        1
    );
    
    // Disable future minting
    let transaction = new Transaction()
    .add(createSetAuthorityInstruction(
        mint,
        wallet.publicKey,
        AuthorityType.MintTokens,
        null
    ));
    
    const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [wallet]);

    console.log(
        "\nTransaction Signature:",
        `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
    );
    console.log(
        "\nToken Account: ",
        `https://solana.fm/address/${associatedTokenAccount.address}?cluster=devnet-solana`
    );
})()
