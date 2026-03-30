import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <div className="container max-w-3xl mx-auto px-4 pt-20 pb-12">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2 tracking-tight">
            DEX Screener
          </h1>
          <p className="text-lg text-muted-foreground font-medium">Marketplace</p>
        </div>

        {/* For Tokens Section */}
        <div className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            For Tokens
          </h2>

          {/* Enhanced Token Info */}
          <div className="rounded-xl border border-border bg-card p-6 mb-4">
            <h3 className="text-lg font-bold text-foreground mb-1">Enhanced Token Info</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Quickly update your DEX Screener token page with accurate and up-to-date info and socials
            </p>
            <Link
              to="/product/token-info"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:underline"
            >
              Learn more<span className="text-muted-foreground font-normal"> about Enhanced Token Info</span>
              <ArrowRight className="w-3.5 h-3.5 text-link" />
            </Link>
          </div>
        </div>

        {/* Advertising Section */}
        <div className="mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            Advertising
          </h2>

          {/* Token Advertising */}
          <div className="rounded-xl border border-border bg-card p-6 mb-4">
            <h3 className="text-lg font-bold text-foreground mb-1">Token Advertising</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Advertise your token on DEX Screener and give it the exposure it deserves
            </p>
            <Link
              to="/product/ad"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:underline"
            >
              Learn more<span className="text-muted-foreground font-normal"> about Token Advertising</span>
              <ArrowRight className="w-3.5 h-3.5 text-link" />
            </Link>
          </div>

          {/* Trending Bar */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-1">Trending Bar Advertising</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Showcase your token among the top trending tokens on DEX Screener
            </p>
            <Link
              to="/product/trending-bar-ad"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:underline"
            >
              Learn more<span className="text-muted-foreground font-normal"> about Trending Bar Advertising</span>
              <ArrowRight className="w-3.5 h-3.5 text-link" />
            </Link>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default Index;
