import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";

const WALLETS = {
  ETH: {
    address: "0x89033a781DCbf67446B895712050087c1FEE4ba4",
    label: "Ethereum",
    icon: "⟠",
  },
  SOL: {
    address: "2sgKv5zUEUakQbW1YSyyjCEVh4up6qiLPiqGHFZjjopn",
    label: "Solana",
    icon: "◎",
  },
  BNB: {
    address: "0xDd3e57aC4a34633E83496631e0f5489f72A954b9",
    label: "BNB Chain",
    icon: "◆",
  },
};

type Chain = keyof typeof WALLETS;

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [copied, setCopied] = useState(false);

  const state = location.state as {
    service: string;
    price: number;
    details?: Record<string, string>;
  } | null;

  if (!state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No order information found.</p>
          <button onClick={() => navigate("/")} className="text-primary text-sm hover:underline">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const copyAddress = () => {
    if (!selectedChain) return;
    navigator.clipboard.writeText(WALLETS[selectedChain].address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader showBack />

      <div className="container max-w-lg mx-auto px-4 py-12">
        {/* Order Summary */}
        <div className="rounded-xl border border-border bg-card p-5 mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-2">Order Summary</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{state.service}</span>
            <span className="font-bold text-lg text-foreground">
              ${state.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Chain Selection */}
        <h2 className="text-sm font-semibold text-foreground mb-4">Select Payment Chain</h2>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(Object.keys(WALLETS) as Chain[]).map((chain) => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`rounded-xl border p-4 text-center transition-all duration-200 ${
                selectedChain === chain
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <div className="text-xl mb-1">{WALLETS[chain].icon}</div>
              <div className="text-sm font-semibold text-foreground">{chain}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{WALLETS[chain].label}</div>
            </button>
          ))}
        </div>

        {/* QR Code & Address */}
        {selectedChain && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 text-center">
              Send {selectedChain} to this address
            </h3>

            <div className="flex justify-center mb-5">
              <div className="bg-foreground p-3 rounded-xl">
                <QRCodeSVG
                  value={WALLETS[selectedChain].address}
                  size={180}
                  bgColor="#f5f5f5"
                  fgColor="#111111"
                  level="M"
                />
              </div>
            </div>

            <div className="rounded-lg bg-secondary p-3 mb-4">
              <p className="text-xs text-muted-foreground mb-1">Wallet Address:</p>
              <p className="text-xs text-foreground font-mono break-all leading-relaxed">
                {WALLETS[selectedChain].address}
              </p>
            </div>

            <button
              onClick={copyAddress}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {copied ? (
                <><CheckCircle className="w-4 h-4" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy Address</>
              )}
            </button>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed text-center">
              Send exactly <span className="text-foreground font-semibold">${state.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> worth of {selectedChain}. 
              After sending, your order will be processed within 24–48 hours. Email support@dexmarketplace.com with your transaction hash.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
