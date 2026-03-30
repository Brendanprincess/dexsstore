import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";

const features = [
  "Custom token logo displayed on listing",
  "Token description and project details",
  "Website URL linked on token page",
  "Social media links (Twitter, Telegram, Discord)",
  "Verified badge for your token",
  "Priority indexing on search results",
];

const TokenInfoProduct = () => {
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader showBack />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">Enhanced Token Info</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Make your token stand out with verified information displayed directly on your token's listing page.
          Add your logo, project description, website, and social links to build trust and credibility.
        </p>

        <div className="space-y-3 mb-8">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-muted-foreground line-through text-sm">$299.00</span>
            <span className="text-2xl font-bold text-foreground">$269.10</span>
            <span className="text-xs text-primary font-medium">(-10%)</span>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Processing typically takes 24–48 hours after payment confirmation.
          </p>
          <Link to="/product/token-info/order" className="btn-learn-more w-full flex justify-center py-3">
            Order Now — from $299.00 $269.10 (-10%)
          </Link>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default TokenInfoProduct;
