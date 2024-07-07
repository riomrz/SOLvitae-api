import {
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    clusterApiUrl,
    sendAndConfirmTransaction,
  } from "@solana/web3.js";
  import {
    MINT_SIZE,
    TOKEN_2022_PROGRAM_ID,
    createInitializeMint2Instruction,
    getMinimumBalanceForRentExemptMint,
    createMint,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddressSync,
    createAccount,
    createMintToInstruction,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    createTransferInstruction,
  } from "@solana/spl-token";

const createMintAccount = async () => {
      const wallet = Keypair.generate();
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      
      // Generate keypair to use as address of mint account
      const mint = new Keypair();
      
      // Calculate minimum lamports for space required by mint account
      const rentLamports = await getMinimumBalanceForRentExemptMint(connection);
      
      // Instruction to create new account with space for new mint account
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports: rentLamports,
        programId: TOKEN_2022_PROGRAM_ID,
      });
      
      // Instruction to initialize mint account
      const initializeMintInstruction = createInitializeMint2Instruction(
        mint.publicKey,
        2, // decimals
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority
        TOKEN_2022_PROGRAM_ID
      );
      
      // Build transaction with instructions to create new account and initialize mint account
      const transaction = new Transaction().add(
        createAccountInstruction,
        initializeMintInstruction
      );
      
      const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [
          wallet.keypair, // payer
          mint, // mint address keypair
        ]
      );
      
      console.log(
        "\nTransaction Signature:",
        `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
      );
      
      console.log(
        "\nMint Account:",
        `https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
      );
}

const createTokenAccount = async () => {     
      const wallet = pg.wallet;
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      
      // Create new Mint Account
      const mint = await createMint(
        connection,
        wallet.keypair, // payer
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority
        2, // decimals
        new Keypair(), // keypair for mint account
        null,
        TOKEN_2022_PROGRAM_ID
      );
      
      // Derive PDA
      const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
        mint, // mint address
        wallet.publicKey, // token account owner
        false, // allow owner off-curve (PDA)
        TOKEN_2022_PROGRAM_ID
      );
      
      // Instruction to create associated token account
      const instruction = createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        associatedTokenAccountAddress, // token account address
        wallet.publicKey, // owner
        mint, // mint address
        TOKEN_2022_PROGRAM_ID
      );
      
      // Create transaction with instruction
      const transaction = new Transaction().add(instruction);
      
      // Sign and send transaction
      const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [
          wallet.keypair, // payer
        ]
      );
      
      console.log(
        "\nTransaction Signature:",
        `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
      );
      
      console.log(
        "\nToken Account: ",
        `https://explorer.solana.com/address/${associatedTokenAccountAddress}?cluster=devnet`
      );      
}

const mintToken = async () => {      
      const wallet = pg.wallet;
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      
      // Create new Mint Account
      const mint = await createMint(
        connection,
        wallet.keypair, // payer
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority
        2, // decimals
        new Keypair(), // keypair for mint account
        null,
        TOKEN_2022_PROGRAM_ID
      );
      
      // Create new Token Account, defaults to ATA (Associated Token Account)
      const tokenAccount = await createAccount(
        connection,
        wallet.keypair, // payer
        mint, // mint address
        wallet.publicKey, // token account owner
        null,
        null,
        TOKEN_2022_PROGRAM_ID
      );
      
      const instruction = createMintToInstruction(
        mint, // mint address
        tokenAccount, // destination
        wallet.publicKey, // mint authority
        100, // amount
        [],
        TOKEN_2022_PROGRAM_ID
      );
      
      const transaction = new Transaction().add(instruction);
      
      // Sign and send transaction
      const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [
          wallet.keypair, // payer, mint authority
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
}

const transferTokens = async () => {
      const wallet = pg.wallet;
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      
      // Create new Mint Account
      const mint = await createMint(
        connection,
        wallet.keypair, // payer
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority
        2, // decimals
        new Keypair(), // keypair for mint account
        null,
        TOKEN_2022_PROGRAM_ID
      );
      
      // Create token account for sender
      const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet.keypair, // payer
        mint, // mint address
        wallet.publicKey, // token account owner
        false,
        "confirmed",
        null,
        TOKEN_2022_PROGRAM_ID
      );
      
      // Create token account for recipient
      const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet.keypair, // payer
        mint,
        new Keypair().publicKey, // token account owner
        false,
        "confirmed",
        null,
        TOKEN_2022_PROGRAM_ID
      );
      
      // Mint tokens to sourceTokenAccount
      await mintTo(
        connection,
        wallet.keypair, // payer
        mint, // mint address
        sourceTokenAccount.address, // destination
        wallet.publicKey, // mint authority
        100, // amount
        [],
        {
          commitment: "confirmed",
        },
        TOKEN_2022_PROGRAM_ID
      );
      
      // Create instruction to transfer tokens
      const instruction = createTransferInstruction(
        sourceTokenAccount.address, // transfer from
        destinationTokenAccount.address, // transfer to
        wallet.publicKey, // source token account owner
        100, // amount
        [],
        TOKEN_2022_PROGRAM_ID
      );
      
      // Create transaction
      const transaction = new Transaction().add(instruction);
      
      // Sign and send transaction
      const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [
          wallet.keypair, // payer, owner
        ]
      );
      
      console.log(
        "\nTransaction Signature:",
        `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
      );      
}