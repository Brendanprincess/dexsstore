import { Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      {/* Hero glow overlay */}
      <div className="bg-hero-glow">
        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-none mb-2">
            DEX Screener
          </h1>
          <p className="text-4xl md:text-5xl font-bold italic text-muted-foreground/60 tracking-tight">
            Marketplace
          </p>
        </div>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-t border-border my-10" />
        </div>

        {/* For Tokens */}
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <h2 className="text-2xl font-bold text-foreground mb-5">For Tokens</h2>
          <div className="max-w-md">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Enhanced Token Info</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Quickly update your DEX Screener token page with accurate and up-to-date info and socials
              </p>
              <Link to="/product/token-info" className="btn-learn-more">
                Learn more
              </Link>
            </div>
          </div>
        </div>

        {/* Advertising */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="text-2xl font-bold text-foreground mb-5">Advertising</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Token Advertising</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Advertise your token on DEX Screener and give it the exposure it deserves
              </p>
              <Link to="/product/ad" className="btn-learn-more">
                Learn more
              </Link>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Trending Bar Advertising</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Showcase your token among the top trending tokens on DEX Screener
              </p>
              <Link to="/product/trending-bar-ad" className="btn-learn-more">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default Index;
