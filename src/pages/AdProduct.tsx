import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";

const features = [
  "Banner ads displayed across token listing pages",
  "Targeted placement by chain and token category",
  "Real-time impression and click analytics",
  "Custom creative — upload your own banner design",
  "Flexible duration: 1 day, 7 days, or 30 days",
  "Millions of daily active users as potential audience",
];

const packages = [
  { name: "Starter", price: "$500", duration: "1 day", impressions: "~50K" },
  { name: "Growth", price: "$2,500", duration: "7 days", impressions: "~350K" },
  { name: "Premium", price: "$8,000", duration: "30 days", impressions: "~1.5M" },
];

const AdProduct = () => {
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader showBack />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">Token Advertising</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Boost your token's visibility with banner ads placed strategically across the platform.
        </p>

        <div className="space-y-3 mb-8">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          {packages.map((pkg) => (
            <div key={pkg.name} className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground text-sm">{pkg.name}</span>
                <p className="text-xs text-muted-foreground">{pkg.duration} • {pkg.impressions}</p>
              </div>
              <span className="font-bold text-foreground">{pkg.price}</span>
            </div>
          ))}
        </div>

        <Link to="/product/ad/order" className="btn-learn-more w-full flex justify-center py-3">
          Order Now
        </Link>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default AdProduct;
