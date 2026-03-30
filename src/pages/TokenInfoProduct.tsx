import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Check, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <MarketplaceHeader showBack />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-10"
        >
          {/* Left - Info */}
          <div>
            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 animate-float">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              Enhanced Token Info
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Make your token stand out with verified information displayed directly on your token's listing page.
              Add your logo, project description, website, and social links to build trust and credibility.
            </p>

            <div className="space-y-3 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-4 mb-6">
              <p className="text-xs text-muted-foreground">
                Processing typically takes 24–48 hours after payment confirmation.
                Changes remain active for the lifetime of the token.
              </p>
            </div>
          </div>

          {/* Right - Pricing */}
          <div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">Pricing</h2>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-muted-foreground line-through text-lg">$299.00</span>
                <span className="font-display text-3xl font-bold text-primary">$269.10</span>
              </div>
              <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-6">
                Save 10%
              </span>

              <Link
                to="/product/token-info/order"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity shadow-glow"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Pay with ETH, SOL, or BNB
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default TokenInfoProduct;
