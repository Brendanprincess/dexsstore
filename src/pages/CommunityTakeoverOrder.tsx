import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import Breadcrumb from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CHAINS = [
  { value: "solana", label: "Solana" },
  { value: "ethereum", label: "Ethereum" },
  { value: "bsc", label: "BNB Chain" },
  { value: "base", label: "Base" },
  { value: "arbitrum", label: "Arbitrum" },
];

const LINK_BUTTONS = [
  { key: "website", label: "Add Website" },
  { key: "docs", label: "Add Docs" },
  { key: "x", label: "Add X" },
  { key: "telegram", label: "Add Telegram" },
  { key: "discord", label: "Add Discord" },
  { key: "tiktok", label: "Add Tiktok" },
  { key: "instagram", label: "Add Instagram" },
  { key: "reddit", label: "Add Reddit" },
  { key: "farcaster", label: "Add Farcaster" },
];

const CommunityTakeoverOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chain, setChain] = useState(searchParams.get("chainId") || "");
  const [tokenAddress, setTokenAddress] = useState(searchParams.get("tokenAddress") || "");

  const [links, setLinks] = useState<Record<string, string>>({});
  const [activeLinkFields, setActiveLinkFields] = useState<string[]>([]);
  const [additionalLinks, setAdditionalLinks] = useState<string[]>([]);
  const [supplyDescription, setSupplyDescription] = useState("");
  const [lockedAddresses, setLockedAddresses] = useState<string[]>([]);

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);

  const toggleLinkField = (key: string) => {
    if (activeLinkFields.includes(key)) {
      setActiveLinkFields(activeLinkFields.filter((k) => k !== key));
      const newLinks = { ...links };
      delete newLinks[key];
      setLinks(newLinks);
    } else {
      setActiveLinkFields([...activeLinkFields, key]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chain || !tokenAddress || !check1 || !check2) return;
    navigate("/payment", {
      state: {
        service: "Token Community Takeover",
        price: 199.00,
        details: { chain, tokenAddress, links, additionalLinks, lockedAddresses, supplyDescription },
      },
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Chain */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Chain</h2>
              <Select value={chain} onValueChange={setChain}>
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

            {/* Token Address */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Token Address</h2>
              <Input
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder=""
                className="bg-secondary border-border text-foreground"
              />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Description</h2>
              <Textarea
                placeholder=""
                className="bg-secondary border-border text-foreground min-h-[100px]"
              />
            </div>

            {/* Links */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Links</h2>
              <div className="grid grid-cols-2 gap-3">
                {LINK_BUTTONS.map((btn) => (
                  <div key={btn.key}>
                    {activeLinkFields.includes(btn.key) ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground font-medium">{btn.label.replace("Add ", "")}</span>
                          <button type="button" onClick={() => toggleLinkField(btn.key)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
                        </div>
                        <Input
                          value={links[btn.key] || ""}
                          onChange={(e) => setLinks({ ...links, [btn.key]: e.target.value })}
                          placeholder=""
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleLinkField(btn.key)}
                        className="w-full rounded-lg border border-border bg-secondary text-foreground text-sm font-medium py-5 hover:border-muted-foreground transition-colors"
                      >
                        {btn.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional links */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Additional links</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Please provide additional links that don't fit into the above categories. For example, links to other social media profiles.
              </p>
              {additionalLinks.map((link, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    value={link}
                    onChange={(e) => {
                      const updated = [...additionalLinks];
                      updated[i] = e.target.value;
                      setAdditionalLinks(updated);
                    }}
                    className="bg-secondary border-border text-foreground"
                  />
                  <button type="button" onClick={() => setAdditionalLinks(additionalLinks.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground px-2">✕</button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setAdditionalLinks([...additionalLinks, ""])}
                className="border border-border bg-transparent text-foreground rounded-lg px-5 py-2 text-sm hover:bg-secondary transition-colors"
              >
                Add link
              </button>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Images</h2>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Icon</h3>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside">
                  <li>1:1 aspect ratio (square, for example <code className="text-muted-foreground">100x100</code>px or <code className="text-muted-foreground">500x500</code>px)</li>
                  <li>min. image width: 100px</li>
                  <li>support formats: png, jpg, webp and gif</li>
                  <li>max. file size: 4.5MB</li>
                </ul>
                <button type="button" className="bg-secondary border border-border text-foreground rounded-lg px-6 py-3 w-full max-w-xs hover:bg-muted transition-colors">
                  Upload image
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Header</h3>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside">
                  <li>3:1 aspect ratio (rectangle, for example <code className="text-muted-foreground">600x200</code>px or <code className="text-muted-foreground">1500x500</code>px)</li>
                  <li>min. image width: 600px</li>
                  <li>support formats: png, jpg, webp and gif</li>
                  <li>max. file size: 4.5MB</li>
                </ul>
                <button type="button" className="bg-secondary border border-border text-foreground rounded-lg px-6 py-3 w-full max-w-xs hover:bg-muted transition-colors">
                  Upload image
                </button>
              </div>
            </div>

            {/* Locked Supply */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                Locked Supply <span className="text-muted-foreground font-normal text-base">(Optional)</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-2 mb-4 leading-relaxed">
                Locked Supply refers to the portion of a cryptocurrency's total supply that is not available for trading or circulation. These tokens are often held in reserve for future use, such as development, partnerships, or team incentives. <strong className="text-foreground">Not to be confused with Locked Liquidity.</strong>
              </p>

              <h3 className="text-lg font-bold text-foreground mb-2">Locked Addresses</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Provide an <strong className="text-foreground">optional</strong> list of addresses with locked tokens. You <strong className="text-foreground">don't</strong> need to include the following burn addresses, we check them automatically:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside font-mono">
                <li>0x0000000000000000000000000000000000000000</li>
                <li>0x0000000000000000000000000000000000000001</li>
                <li>0x000000000000000000000000000000000000dead</li>
                <li>0xdead000000000000000000000000000000000000</li>
              </ul>
              {lockedAddresses.map((addr, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    value={addr}
                    onChange={(e) => {
                      const updated = [...lockedAddresses];
                      updated[i] = e.target.value;
                      setLockedAddresses(updated);
                    }}
                    className="bg-secondary border-border text-foreground font-mono"
                  />
                  <button type="button" onClick={() => setLockedAddresses(lockedAddresses.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground px-2">✕</button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setLockedAddresses([...lockedAddresses, ""])}
                className="border border-border bg-transparent text-foreground rounded-lg px-5 py-2 text-sm hover:bg-secondary transition-colors mb-6"
              >
                Add address
              </button>

              <h3 className="text-lg font-bold text-foreground mb-3 mt-4">Supply Description</h3>
              <Textarea
                value={supplyDescription}
                onChange={(e) => setSupplyDescription(e.target.value)}
                placeholder=""
                className="bg-secondary border-border text-foreground min-h-[120px]"
              />
              <p className="text-sm text-muted-foreground mt-2">Provide a brief explanation of why and how supply is locked</p>
            </div>

            {/* Order summary */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Order summary</h2>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex justify-between px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  <span>Product</span>
                  <span>Price</span>
                </div>
                <div className="px-4 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-foreground font-medium">Token Community Takeover</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ETA: Submission will be verified by DEX Screener. Average processing time after receiving payment is less than 15 minutes.
                      </p>
                    </div>
                    <span className="text-foreground font-medium whitespace-nowrap ml-4">
                      <span className="line-through text-muted-foreground mr-2">$499.00</span>$199.00
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={check1} onChange={(e) => setCheck1(e.target.checked)} className="mt-1 accent-primary" />
                <span className="text-sm text-foreground font-medium">
                  I understand that all supplied data must be verifiable through official channels such as website and socials.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={check2} onChange={(e) => setCheck2(e.target.checked)} className="mt-1 accent-primary" />
                <span className="text-sm text-foreground font-medium">
                  I understand and accept that DEX Screener reserves the right to reject or modify the provided information.
                </span>
              </label>
            </div>

            <p className="text-sm text-foreground">
              By completing this purchase, I confirm that I've read and agree to the{" "}
              <a href="#" className="text-primary underline hover:no-underline">Refund Policy</a>.
            </p>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!chain || !tokenAddress || !check1 || !check2}
                className="btn-learn-more px-10 py-3 text-base disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Order Now
              </button>
            </div>
          </form>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default CommunityTakeoverOrder;
