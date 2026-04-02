export type ChainOption = {
  value: string;
  label: string;
  icon?: string;
};

const llamaIcon = (slug: string) => `https://icons.llamao.fi/icons/chains/rsz_${slug}.jpg`;

const valueOverrides: Record<string, string> = {
  BSC: "bsc",
  Base: "base",
  Ethereum: "ethereum",
  Polygon: "polygon",
  Solana: "solana",
  Avalanche: "avalanche",
  Arbitrum: "arbitrum",
  "Arbitrum Nova": "arbitrum-nova",
  "Avalanche DFK": "avalanche-dfk",
  "Flow EVM": "flow-evm",
  HyperEVM: "hyperevm",
  "Sei V2": "sei-v2",
  "Step Network": "step-network",
  "Loop Network": "loop-network",
  "Merlin Chain": "merlin-chain",
  "Neon EVM": "neon-evm",
  opBNB: "opbnb",
  NEAR: "near",
  TON: "ton",
  Tron: "tron",
  XRPL: "xrpl",
  zkSync: "zksync",
  ZKFair: "zkfair",
  ICP: "icp",
};

const toValue = (label: string) => {
  if (valueOverrides[label]) return valueOverrides[label];
  return label
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const orderedLabels = [
  "Solana",
  "BSC",
  "Base",
  "Ethereum",
  "Polygon",
  "PulseChain",
  "Sui",
  "XRPL",
  "TON",
  "Avalanche",
  "Arbitrum",
  "Hyperliquid",
  "Cronos",
  "Abstract",
  "Osmosis",
  "Hedera",
  "Monad",
  "World Chain",
  "HyperEVM",
  "Sonic",
  "Tron",
  "NEAR",
  "Linea",
  "Plasma",
  "Berachain",
  "Algorand",
  "Optimism",
  "Ink",
  "MegaETH",
  "ApeChain",
  "MultiversX",
  "Aptos",
  "Sei V2",
  "Fantom",
  "Cardano",
  "Mantle",
  "Flare",
  "zkSync",
  "Katana",
  "Soneium",
  "Blast",
  "Starknet",
  "Polkadot",
  "Unichain",
  "Celo",
  "Fogo",
  "Dogechain",
  "Harmony",
  "Metis",
  "Story",
  "Scroll",
  "Avalanche DFK",
  "Flow EVM",
  "Injective",
  "Taiko",
  "Conflux",
  "EthereumPoW",
  "Kava",
  "Manta",
  "Arbitrum Nova",
  "IoTeX",
  "Moonriver",
  "opBNB",
  "Energi",
  "Beam",
  "Stacks",
  "Moonbeam",
  "Vana",
  "Merlin Chain",
  "Ethereum Classic",
  "Mode",
  "Astar",
  "Boba",
  "Elastos",
  "Movement",
  "Aurora",
  "Venom",
  "Zora",
  "Neon EVM",
  "Oasis Sapphire",
  "Fuse",
  "KCC",
  "Meter",
  "Step Network",
  "Zircuit",
  "Oasis Emerald",
  "Telos",
  "ZKFair",
  "ICP",
  "Loop Network",
];

export const CHAINS: ChainOption[] = orderedLabels.map((label) => {
  const value = toValue(label);
  return { value, label, icon: llamaIcon(value) };
});
