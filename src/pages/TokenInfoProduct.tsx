import { Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import Breadcrumb from "@/components/Breadcrumb";
import CryptoIcons from "@/components/CryptoIcons";

const TokenInfoProduct = () => {
  const discounted = (value: number) => (value * 0.9).toFixed(2);
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 text-center">
          <Breadcrumb items={[{ label: "Enhanced Token Info" }]} />

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Enhanced Token Info
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Quickly update your DEX Screener token page with accurate and up-to-date info and socials
          </p>

          <Link
            to="/product/token-info/order"
            className="btn-learn-more px-8 py-3 text-base"
          >
            Order Now -&nbsp; {`$${discounted(299)}`}
          </Link>

          <CryptoIcons text="Pay with crypto or credit card" />
        </div>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-t border-border" />
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Update your token info with DEX Screener directly to{" "}
            <strong className="text-foreground">grow your community</strong> and{" "}
            <strong className="text-foreground">stand out from the crowd</strong>!
          </p>
        </div>

        {/* Features - "Stand out" / "Credibility" / "Community" / "Market Cap" */}
        <div className="max-w-4xl mx-auto px-6 pb-16 space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Stand out from the crowd</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your project's logo and socials can be displayed on DEX Screener front and center, so traders can easily spot and interact with it!
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Credibility</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Show your project's commitment to transparency and trust and inform potential token holders of the project's vision, team and roadmap
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Community Engagement</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Crypto projects live and die by their communities: Enhanced Token Info boosts social engagement and helps bring token holders together to connect and collaborate for shared success
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Accurate Market Cap</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Set wallets holding locked supply and ensure your token's market cap is always displayed correctly
            </p>
          </div>

          {/* How does it work */}
          <div className="pt-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">How does it work?</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 text-sm font-bold">1</div>
                <h3 className="font-semibold text-foreground mb-1">Set token info</h3>
                <p className="text-sm text-muted-foreground">Fill out the form in under a minute</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 text-sm font-bold">2</div>
                <h3 className="font-semibold text-foreground mb-1">Pay</h3>
                <p className="text-sm text-muted-foreground">All major cryptocurrencies and credit/debit cards accepted</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 text-sm font-bold">3</div>
                <h3 className="font-semibold text-foreground mb-1">Wait for processing</h3>
                <p className="text-sm text-muted-foreground">Most orders are processed within just a few minutes, but please allow up to 12 hours</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 text-sm font-bold">✓</div>
                <h3 className="font-semibold text-foreground mb-1">Done!</h3>
                <p className="text-sm text-muted-foreground">Your token info is live on the DEX Screener website and apps!</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-4">
            <Link
              to="/product/token-info/order"
              className="btn-learn-more px-8 py-3 text-base"
            >
              Order Now -&nbsp; {`$${discounted(299)}`}
            </Link>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default TokenInfoProduct;
