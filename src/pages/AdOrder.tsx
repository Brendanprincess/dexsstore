import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import Breadcrumb from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AD_PACKAGES = [
  { value: "starter", label: "Starter — $299 (50K impressions)", price: 299 },
  { value: "growth", label: "Growth — $499 (100K impressions)", price: 499 },
  { value: "premium", label: "Premium — $999 (250K impressions)", price: 999 },
];

const CHAINS = [
  { value: "solana", label: "Solana" },
  { value: "ethereum", label: "Ethereum" },
  { value: "bsc", label: "BNB Chain" },
  { value: "base", label: "Base" },
];

const AdOrder = () => {
  const navigate = useNavigate();
  const [chain, setChain] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [projectName, setProjectName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");

  const pkg = AD_PACKAGES.find((p) => p.value === selectedPackage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/payment", {
      state: {
        service: `Token Advertising — ${pkg?.label.split("—")[0].trim()}`,
        price: pkg?.price || 299,
        details: { chain, tokenAddress, projectName, email, package: selectedPackage },
      },
    });
  };

  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 text-center">
          <Breadcrumb items={[
            { label: "Token Advertising", to: "/product/ad" },
            { label: "Order" },
          ]} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">
            Token Advertising
          </h1>
        </div>

        <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Ad Package *</Label>
              <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Select package" /></SelectTrigger>
                <SelectContent>
                  {AD_PACKAGES.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Chain *</Label>
                <Select value={chain} onValueChange={setChain}>
                  <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Select chain" /></SelectTrigger>
                  <SelectContent>
                    {CHAINS.map((c) => (<SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Project Name *</Label>
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Your project name" className="bg-secondary border-border text-foreground" />
              </div>
            </div>

            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Token Contract Address *</Label>
              <Input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder="Enter token contract address" className="bg-secondary border-border text-foreground" />
            </div>

            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Contact Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-secondary border-border text-foreground" />
            </div>

            <button type="submit" disabled={!selectedPackage || !chain || !tokenAddress || !projectName || !email} className="btn-learn-more w-full py-3 text-base disabled:opacity-40 disabled:cursor-not-allowed">
              Order Now {pkg ? `— $${pkg.price.toLocaleString()}.00` : ""}
            </button>
          </form>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default AdOrder;
