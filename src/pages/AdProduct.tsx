import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone, Check, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <MarketplaceHeader showBack />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="w-14 h-14 rounded-xl bg-gradient-accent flex items-center justify-center mb-5 animate-float">
                <Megaphone className="w-7 h-7 text-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-3">
                Token Advertising
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Boost your token's visibility with banner ads placed strategically across the platform.
                Reach millions of traders actively browsing token listings.
              </p>

              <div className="space-y-3 mb-8">
                {features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="space-y-4 sticky top-24">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Packages</h2>
                {packages.map((pkg) => (
                  <div key={pkg.name} className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-semibold text-foreground">{pkg.name}</span>
                      <span className="font-display text-xl font-bold text-primary">{pkg.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pkg.duration} • {pkg.impressions} impressions
                    </p>
                  </div>
                ))}

                <Link
                  to="/product/ad/order"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity shadow-glow mt-4"
                >
                  Order Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default AdProduct;
