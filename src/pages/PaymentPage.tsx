import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle, ArrowLeft } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";

const WALLETS = {
  ETH: {
    address: "0x89033a781DCbf67446B895712050087c1FEE4ba4",
    label: "Ethereum (ETH)",
    icon: "⟠",
    color: "from-[hsl(231,60%,55%)] to-[hsl(231,60%,40%)]",
  },
  SOL: {
    address: "2sgKv5zUEUakQbW1YSyyjCEVh4up6qiLPiqGHFZjjopn",
    label: "Solana (SOL)",
    icon: "◎",
    color: "from-[hsl(270,70%,55%)] to-[hsl(280,60%,40%)]",
  },
  BNB: {
    address: "0xDd3e57aC4a34633E83496631e0f5489f72A954b9",
    label: "BNB Chain (BNB)",
    icon: "◆",
    color: "from-[hsl(38,90%,50%)] to-[hsl(38,80%,38%)]",
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
          <button onClick={() => navigate("/")} className="text-primary hover:underline">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Order Summary */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card mb-8">
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">Order Summary</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{state.service}</span>
              <span className="font-display font-bold text-xl text-primary">
                ${state.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Chain Selection */}
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Select Payment Chain
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {(Object.keys(WALLETS) as Chain[]).map((chain) => (
              <button
                key={chain}
                onClick={() => setSelectedChain(chain)}
                className={`rounded-xl border p-4 text-center transition-all duration-200 ${
                  selectedChain === chain
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="text-2xl mb-1">{WALLETS[chain].icon}</div>
                <div className="font-display text-sm font-semibold text-foreground">{chain}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {WALLETS[chain].label.split("(")[0].trim()}
                </div>
              </button>
            ))}
          </div>

          {/* QR Code & Address */}
          {selectedChain && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <h3 className="font-display text-base font-semibold text-foreground mb-4 text-center">
                Send {selectedChain} to this address
              </h3>

              <div className="flex justify-center mb-5">
                <div className="bg-foreground p-3 rounded-xl">
                  <QRCodeSVG
                    value={WALLETS[selectedChain].address}
                    size={180}
                    bgColor="hsl(210, 20%, 92%)"
                    fgColor="hsl(220, 20%, 6%)"
                    level="M"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-secondary p-3 mb-4">
                <p className="text-xs text-muted-foreground mb-1">Wallet Address:</p>
                <p className="text-sm text-foreground font-mono break-all leading-relaxed">
                  {WALLETS[selectedChain].address}
                </p>
              </div>

              <button
                onClick={copyAddress}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-display text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Address
                  </>
                )}
              </button>

              <div className="mt-5 rounded-lg bg-warning/10 border border-warning/20 p-3">
                <p className="text-xs text-foreground leading-relaxed">
                  <strong>Important:</strong> Send exactly{" "}
                  <span className="text-primary font-semibold">
                    ${state.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>{" "}
                  worth of {selectedChain} to the address above. After sending, your order will be
                  processed within 24–48 hours. Contact{" "}
                  <span className="text-primary">support@dexmarketplace.com</span> with your
                  transaction hash for faster processing.
                </p>
              </div>
            </motion.div>
          )}

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-8 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to order form
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
