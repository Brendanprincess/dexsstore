import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

const CHAINS = [
  { value: "solana", label: "Solana" },
  { value: "ethereum", label: "Ethereum" },
  { value: "bsc", label: "BNB Chain" },
  { value: "base", label: "Base" },
  { value: "arbitrum", label: "Arbitrum" },
];

const CommunityTakeoverOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chain, setChain] = useState(searchParams.get("chainId") || "");
  const [tokenAddress, setTokenAddress] = useState(searchParams.get("tokenAddress") || "");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/payment", {
      state: {
        service: "Community Takeover Claim",
        price: 199.00,
        details: { chain, tokenAddress, email, reason },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader showBack />

      <div className="container max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Community Takeover Claim
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Claim control of a token's info page. Price: <span className="text-primary font-semibold">$199.00</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-foreground">Chain *</Label>
              <Select value={chain} onValueChange={setChain}>
                <SelectTrigger className="mt-1.5 bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  {CHAINS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground">Token Contract Address *</Label>
              <Input
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Enter token contract address"
                className="mt-1.5 bg-secondary border-border text-foreground"
              />
            </div>

            <div>
              <Label className="text-foreground">Contact Email *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 bg-secondary border-border text-foreground"
              />
            </div>

            <div>
              <Label className="text-foreground">Reason for Takeover</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you're claiming this token"
                className="mt-1.5 bg-secondary border-border text-foreground min-h-[100px]"
              />
            </div>

            <button
              type="submit"
              disabled={!chain || !tokenAddress || !email}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-glow"
            >
              Order Now — $199.00 <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default CommunityTakeoverOrder;
