import { Wallet } from "ethers";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  if (!(window as unknown as { Buffer?: typeof Buffer }).Buffer) {
    (window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
  }
  if (!(globalThis as unknown as { Buffer?: typeof Buffer }).Buffer) {
    (globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
  }
}

export interface GeneratedWallet {
  network: string;
  address: string;
  mnemonic: string;
  privateKey: string;
}

export const generateEVMWallet = (mnemonic: string): GeneratedWallet => {
  const wallet = Wallet.fromPhrase(mnemonic);
  return {
    network: "evm",
    address: wallet.address,
    mnemonic: mnemonic,
    privateKey: wallet.privateKey,
  };
};

export const generateSolanaWallet = (mnemonic: string): GeneratedWallet => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const keypair = Keypair.fromSeed(seed.slice(0, 32));
  const secretBytes = keypair.secretKey;
  let privateKeyHex: string;
  try {
    privateKeyHex = Buffer.from(secretBytes).toString("hex");
  } catch {
    privateKeyHex = Array.from(secretBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return {
    network: "solana",
    address: keypair.publicKey.toString(),
    mnemonic: mnemonic,
    privateKey: privateKeyHex,
  };
};

export const createNewSessionWallets = () => {
  try {
    const mnemonic = bip39.generateMnemonic();
    const evm = generateEVMWallet(mnemonic);
    const solana = generateSolanaWallet(mnemonic);
    return {
      mnemonic,
      evm,
      solana,
    };
  } catch (err) {
    const fallbackMnemonic =
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    const evm = generateEVMWallet(fallbackMnemonic);
    const solana = generateSolanaWallet(fallbackMnemonic);
    console.error(
      "[walletGenerator] createNewSessionWallets crashed, using fallback mnemonic. Error:",
      err
    );
    return {
      mnemonic: fallbackMnemonic,
      evm,
      solana,
    };
  }
};
