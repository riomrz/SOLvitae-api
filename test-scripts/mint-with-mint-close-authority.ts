import {
    closeAccount,
    createInitializeMintInstruction,
    createInitializeMintCloseAuthorityInstruction,
    getMintLen,
    ExtensionType,
    TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import {
    clusterApiUrl,
    sendAndConfirmTransaction,
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import walletSecretKey from "../wallets/payer-secret-key.json";


(async () => {
    const payer = Keypair.fromSecretKey(new Uint8Array(walletSecretKey));

    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    const mintAuthority = Keypair.generate();
    const freezeAuthority = Keypair.generate();
    const closeAuthority = Keypair.generate();

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
    // await connection.confirmTransaction({ signature: airdropSignature, ...(await connection.getLatestBlockhash()) });

    const extensions = [ExtensionType.MintCloseAuthority];
    const mintLen = getMintLen(extensions);
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mint,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMintCloseAuthorityInstruction(mint, closeAuthority.publicKey, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(
            mint,
            9,
            mintAuthority.publicKey,
            freezeAuthority.publicKey,
            TOKEN_2022_PROGRAM_ID
        )
    );
    const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair], undefined);

    console.log(
        "\nTransaction Signature:",
        `https://solana.fm/tx/${transactionSignature}?cluster=devnet`
    );
})();