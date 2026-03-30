import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <MarketplaceHeader showBack />

      <div className="container max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Order Token Advertising
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Set up your ad campaign details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-foreground">Ad Package *</Label>
              <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                <SelectTrigger className="mt-1.5 bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {AD_PACKAGES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
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
                <Label className="text-foreground">Project Name *</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Your project name"
                  className="mt-1.5 bg-secondary border-border text-foreground"
                />
              </div>
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

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label className="text-foreground">Banner Image URL</Label>
                <Input
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://... (728x90 recommended)"
                  className="mt-1.5 bg-secondary border-border text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground">Click-through URL</Label>
                <Input
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://yourproject.com"
                  className="mt-1.5 bg-secondary border-border text-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedPackage || !chain || !tokenAddress || !projectName || !email}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-glow"
            >
              Order Now {pkg ? `— $${pkg.price.toLocaleString()}` : ""} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default AdOrder;
