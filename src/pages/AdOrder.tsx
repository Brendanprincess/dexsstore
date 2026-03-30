import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AD_PACKAGES = [
  { value: "starter", label: "Starter — $500 (1 day)", price: 500 },
  { value: "growth", label: "Growth — $2,500 (7 days)", price: 2500 },
  { value: "premium", label: "Premium — $8,000 (30 days)", price: 8000 },
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
  const [bannerUrl, setBannerUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");

  const pkg = AD_PACKAGES.find((p) => p.value === selectedPackage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/payment", {
      state: {
        service: `Token Advertising — ${pkg?.label.split("—")[0].trim()}`,
        price: pkg?.price || 500,
        details: { chain, tokenAddress, projectName, email, bannerUrl, targetUrl, package: selectedPackage },
      },
    });
  };

  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </Link>
            <span>/</span>
            <Link to="/product/ad" className="hover:text-foreground transition-colors">Token Advertising</Link>
            <span>/</span>
            <span className="text-foreground">Order</span>
          </div>
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

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Banner Image URL</Label>
                <Input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://... (728x90)" className="bg-secondary border-border text-foreground" />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Click-through URL</Label>
                <Input value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://yourproject.com" className="bg-secondary border-border text-foreground" />
              </div>
            </div>

            <button type="submit" disabled={!selectedPackage || !chain || !tokenAddress || !projectName || !email} className="btn-learn-more w-full py-3 text-base disabled:opacity-40 disabled:cursor-not-allowed">
              Order Now {pkg ? `— $${pkg.price.toLocaleString()}` : ""}
            </button>
          </form>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default AdOrder;
