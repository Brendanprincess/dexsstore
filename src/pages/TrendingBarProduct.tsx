import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, Check, ArrowRight } from "lucide-react";
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

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 animate-float">
                <TrendingUp className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-3">
                Trending Bar Ad
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The most premium placement available. Your token gets featured in the trending bar,
                visible to every single user on the platform. Perfect for high-impact launches.
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
                      {pkg.duration} • {pkg.reach}
                    </p>
                  </div>
                ))}

                <Link
                  to="/product/trending-bar-ad/order"
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

export default TrendingBarProduct;
