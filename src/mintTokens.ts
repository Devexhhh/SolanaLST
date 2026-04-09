import { mintTo, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { PRIVATE_KEY, TOKEN_MINT_ADDRESS } from "./address";
import bs58 from "bs58";

const connection = new Connection("https://devnet.helius-rpc.com/?api-key=bb018467-5a49-4c18-893e-764dba912326");

function base58ToKeypair(base58PrivateKey: string): Keypair {
    try {
        const privateKeyBuffer = bs58.decode(base58PrivateKey);
        return Keypair.fromSecretKey(privateKeyBuffer);
    } catch (error) {
        throw new Error("Invalid base58 private key.");
    }
}

const keypair = base58ToKeypair(PRIVATE_KEY!);

export const mintTokens = async (fromAddress: string, amount: number) => {
    const recipient = new PublicKey(fromAddress);

    // Derives the ATA address from (wallet, mint) and creates it if it doesn't exist
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,            // payer for ATA creation
        TOKEN_MINT_ADDRESS,
        recipient           // wallet that will own the token account
    );

    await mintTo(
        connection,
        keypair,
        TOKEN_MINT_ADDRESS,
        tokenAccount.address,  // ← ATA address, not the wallet address
        keypair,               // mint authority
        amount
    );

    console.log(`Minted ${amount} to ${tokenAccount.address.toBase58()}`);
};

export const burnTokens = async (fromAddress: string, toAddress: string, amount: number) => {
    console.log("Burning tokens");
}

export const sendNativeTokens = async (fromAddress: string, toAddress: string, amount: number) => {
    console.log("Sending native tokens");
}