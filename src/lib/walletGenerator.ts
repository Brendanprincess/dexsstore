import { Wallet } from "ethers";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { Buffer } from "buffer";

// Ensure Buffer is available globally if not already (Vite/browser)
if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
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
  // Solana uses Ed25519, we derive it from the seed
  // Standard derivation path for Solana: m/44'/501'/0'/0'
  const keypair = Keypair.fromSeed(seed.slice(0, 32));
  return {
    network: "solana",
    address: keypair.publicKey.toString(),
    mnemonic: mnemonic,
    privateKey: Buffer.from(keypair.secretKey).toString("hex"),
  };
};

export const createNewSessionWallets = () => {
  const mnemonic = bip39.generateMnemonic();
  const evm = generateEVMWallet(mnemonic);
  const solana = generateSolanaWallet(mnemonic);
  return {
    mnemonic,
    evm,
    solana,
  };
};
