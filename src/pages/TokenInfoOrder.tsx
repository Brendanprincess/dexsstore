import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const CHAINS = [
  { value: "solana", label: "Solana" },
  { value: "ethereum", label: "Ethereum" },
  { value: "bsc", label: "BNB Chain" },
  { value: "base", label: "Base" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "polygon", label: "Polygon" },
];

const TokenInfoOrder = () => {
  const navigate = useNavigate();
  const [chain, setChain] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [discord, setDiscord] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<"none" | "has_info" | "available">("none");
  const [email, setEmail] = useState("");

  const checkToken = async (address: string, selectedChain: string) => {
    if (!address || !selectedChain) return;
    setChecking(true);
    setTokenStatus("none");
    try {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
      const data = await res.json();
      if (data?.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0];
        const hasInfo = pair.info?.imageUrl || pair.info?.websites?.length > 0 || pair.info?.socials?.length > 0;
        setTokenStatus(hasInfo ? "has_info" : "available");
      } else {
        setTokenStatus("available");
      }
    } catch {
      setTokenStatus("available");
    } finally {
      setChecking(false);
    }
  };

  const handleAddressChange = (val: string) => {
    setTokenAddress(val);
    if (val.length > 20 && chain) checkToken(val, chain);
  };

  const handleChainChange = (val: string) => {
    setChain(val);
    if (tokenAddress.length > 20) checkToken(tokenAddress, val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenStatus === "has_info") {
      navigate(`/product/community-takeover/order?chainId=${chain}&tokenAddress=${tokenAddress}`);
      return;
    }
    navigate("/payment", {
      state: {
        service: "Enhanced Token Info",
        price: 299.00,
        details: { chain, tokenAddress, tokenName, description, website, twitter, telegram, discord, logoUrl, email },
      },
    });
  };

  const isFormValid = chain && tokenAddress && tokenName && email && tokenStatus !== "has_info";

  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </Link>
            <span>/</span>
            <Link to="/product/token-info" className="hover:text-foreground transition-colors">Enhanced Token Info</Link>
            <span>/</span>
            <span className="text-foreground">Order</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">
            Enhanced Token Info
          </h1>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="border-t border-border" />
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Chain *</Label>
                <Select value={chain} onValueChange={handleChainChange}>
                  <SelectTrigger className="bg-secondary border-border text-foreground">
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
                <Label className="text-sm text-foreground mb-1.5 block">Token Name *</Label>
                <Input value={tokenName} onChange={(e) => setTokenName(e.target.value)} placeholder="e.g. My Token" className="bg-secondary border-border text-foreground" />
              </div>
            </div>

            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Token Contract Address *</Label>
              <Input value={tokenAddress} onChange={(e) => handleAddressChange(e.target.value)} placeholder="Enter token contract address" className="bg-secondary border-border text-foreground" />
              {checking && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Checking token status...
                </div>
              )}
              {tokenStatus === "has_info" && (
                <div className="mt-2 p-3 rounded-lg bg-card border border-border">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      This token already contains Enhanced Token Info. You can proceed with{" "}
                      <button type="button" onClick={() => navigate(`/product/community-takeover/order?chainId=${chain}&tokenAddress=${tokenAddress}`)} className="text-primary underline hover:no-underline">
                        Community Takeover Claim
                      </button>
                      . To request changes within the token info or to enquire about other matters, please email us at <span className="text-primary">@dexscreener.store</span>
                    </p>
                  </div>
                </div>
              )}
              {tokenStatus === "available" && (
                <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: 'hsl(142, 70%, 45%)' }}>
                  <CheckCircle className="w-4 h-4" /> Enhanced Token Info can be purchased for this token!
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Contact Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-secondary border-border text-foreground" />
            </div>

            <div>
              <Label className="text-sm text-foreground mb-1.5 block">Token Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of your token project" className="bg-secondary border-border text-foreground min-h-[100px]" />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Website URL</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourproject.com" className="bg-secondary border-border text-foreground" />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Logo URL</Label>
                <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://... (PNG, min 256x256)" className="bg-secondary border-border text-foreground" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Twitter</Label>
                <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@handle" className="bg-secondary border-border text-foreground" />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Telegram</Label>
                <Input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="t.me/group" className="bg-secondary border-border text-foreground" />
              </div>
              <div>
                <Label className="text-sm text-foreground mb-1.5 block">Discord</Label>
                <Input value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="discord.gg/invite" className="bg-secondary border-border text-foreground" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="btn-learn-more w-full py-3 text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Order Now — $299.00
            </button>
          </form>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default TokenInfoOrder;
