import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import Breadcrumb from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      state: { service: "Token Community Takeover", price: 199.00, details: { chain, tokenAddress, email, reason } },
    });
  };

  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 text-center">
          <Breadcrumb items={[
            { label: "Token Community Takeover", to: "/product/token-community-takeover" },
            { label: "Order" },
          ]} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">
            Token Community Takeover
          </h1>
        </div>

        <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Chain *</Label>
              <Select value={chain} onValueChange={setChain}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Select chain" /></SelectTrigger>
                <SelectContent>{CHAINS.map((c) => (<SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Token Contract Address *</Label>
              <Input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder="Enter token contract address" className="bg-secondary border-border text-foreground" />
            </div>
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Contact Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-secondary border-border text-foreground" />
            </div>
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Reason for Takeover</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why you're claiming this token" className="bg-secondary border-border text-foreground min-h-[100px]" />
            </div>
            <button type="submit" disabled={!chain || !tokenAddress || !email} className="btn-learn-more w-full py-3 text-base disabled:opacity-40 disabled:cursor-not-allowed">
              Order Now — $199.00
            </button>
          </form>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default CommunityTakeoverOrder;
