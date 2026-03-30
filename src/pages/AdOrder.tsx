import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "@/components/ImageUpload";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import Breadcrumb from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AD_PACKAGES = [
  { value: "20k", label: "20k views", price: 299 },
  { value: "50k", label: "50k views", price: 699 },
  { value: "100k", label: "100k views", price: 999 },
  { value: "200k", label: "200k views", price: 1999 },
  { value: "400k", label: "400k views", price: 3999 },
  { value: "800k", label: "800k views", price: 6999 },
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
  const [selectedPackage, setSelectedPackage] = useState("");
  const [title, setTitle] = useState("");
  const [pitch, setPitch] = useState("");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);

  const pkg = AD_PACKAGES.find((p) => p.value === selectedPackage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg || !chain || !tokenAddress || !check1 || !check2) return;
    navigate("/payment", {
      state: {
        service: `Token Advertising — ${pkg.label}`,
        price: pkg.price,
        details: { chain, tokenAddress, title, pitch, package: selectedPackage },
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

            {/* Package Selection - Card Grid */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Package</h2>
              <div className="grid grid-cols-3 gap-3">
                {AD_PACKAGES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setSelectedPackage(p.value)}
                    className={`rounded-lg border p-5 text-center transition-all ${
                      selectedPackage === p.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary hover:border-muted-foreground"
                    }`}
                  >
                    <div className="text-sm font-semibold text-foreground">{p.label}</div>
                    <div className="text-sm text-muted-foreground mt-1">${p.price.toLocaleString()}.00</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Title</h2>
              <div className="relative">
                <Input
                  value={title}
                  onChange={(e) => { if (e.target.value.length <= 50) setTitle(e.target.value); }}
                  placeholder=""
                  className="bg-secondary border-border text-foreground pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{title.length}/50</span>
              </div>
            </div>

            {/* Pitch */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">Pitch</h2>
              <p className="text-sm text-muted-foreground mb-3">A short description of your project to get people interested</p>
              <div className="relative">
                <Input
                  value={pitch}
                  onChange={(e) => { if (e.target.value.length <= 120) setPitch(e.target.value); }}
                  placeholder=""
                  className="bg-secondary border-border text-foreground pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{pitch.length}/120</span>
              </div>
            </div>

            {/* Image */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Image</h2>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside">
                <li>1:1 aspect ratio (square, for example <code className="text-muted-foreground">500x500</code>px)</li>
                <li>min. image width: 100px</li>
                <li>support formats: png, jpg and webp</li>
                <li>max. file size: 4.5MB</li>
              </ul>
              <ImageUpload onFileSelect={(file) => console.log("Ad image:", file.name)} accept="image/png,image/jpeg,image/webp" />
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
                      <p className="text-foreground font-medium">Token Advertising{pkg ? ` — ${pkg.label}` : ""}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ETA: Submission will be verified by DEX Screener. Average processing time after receiving payment is less than 15 minutes.
                      </p>
                    </div>
                    <span className="text-foreground font-medium whitespace-nowrap ml-4">
                      {pkg ? `$${pkg.price.toLocaleString()}.00` : "—"}
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
                disabled={!selectedPackage || !chain || !tokenAddress || !check1 || !check2}
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

export default AdOrder;
