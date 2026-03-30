import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

const TRENDING_PACKAGES = [
  { value: "flash", label: "Flash — $1,500 (1 hour)", price: 1500 },
  { value: "spotlight", label: "Spotlight — $6,000 (6 hours)", price: 6000 },
  { value: "domination", label: "Domination — $15,000 (24 hours)", price: 15000 },
];

const CHAINS = [
  { value: "solana", label: "Solana" },
  { value: "ethereum", label: "Ethereum" },
  { value: "bsc", label: "BNB Chain" },
  { value: "base", label: "Base" },
];

const TrendingBarOrder = () => {
  const navigate = useNavigate();
  const [chain, setChain] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [projectName, setProjectName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");

  const pkg = TRENDING_PACKAGES.find((p) => p.value === selectedPackage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/payment", {
      state: {
        service: `Trending Bar Ad — ${pkg?.label.split("—")[0].trim()}`,
        price: pkg?.price || 1500,
        details: { chain, tokenAddress, projectName, email, package: selectedPackage },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader showBack />

      <div className="container max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Order Trending Bar Ad
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Configure your trending bar placement below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-foreground">Ad Package *</Label>
              <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                <SelectTrigger className="mt-1.5 bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {TRENDING_PACKAGES.map((p) => (
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

export default TrendingBarOrder;
