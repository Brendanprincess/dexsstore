import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";

const features = [
  "Featured placement in the trending bar at the top of the platform",
  "Maximum visibility — seen by every visitor",
  "Clickable token link directly to your listing page",
  "Real-time performance tracking and analytics",
  "Available in 1-hour, 6-hour, and 24-hour slots",
  "Ideal for launches, announcements, and pump events",
];

const packages = [
  { name: "Flash", price: "$1,500", duration: "1 hour", reach: "~100K views" },
  { name: "Spotlight", price: "$6,000", duration: "6 hours", reach: "~500K views" },
  { name: "Domination", price: "$15,000", duration: "24 hours", reach: "~2M views" },
];

const TrendingBarProduct = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader showBack />

      <div className="container max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-foreground mb-2">Trending Bar Advertising</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          The most premium placement available. Your token gets featured in the trending bar,
          visible to every single user on the platform.
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
            <div key={pkg.name} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground text-sm">{pkg.name}</span>
                <p className="text-xs text-muted-foreground">{pkg.duration} • {pkg.reach}</p>
              </div>
              <span className="font-bold text-foreground">{pkg.price}</span>
            </div>
          ))}
        </div>

        <Link
          to="/product/trending-bar-ad/order"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Order Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default TrendingBarProduct;
