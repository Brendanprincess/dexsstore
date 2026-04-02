import { Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import Breadcrumb from "@/components/Breadcrumb";
import CryptoIcons from "@/components/CryptoIcons";

const TrendingBarProduct = () => {
  const originalFrom = 2000;
  const discountedFrom = (value: number) => (value * 0.9).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 text-center">
          <Breadcrumb items={[{ label: "Trending Bar Advertising" }]} />

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Trending Bar Advertising
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Showcase your token among the top trending tokens on DEX Screener
          </p>

          <Link to="/product/trending-bar-ad/order" className="btn-learn-more px-8 py-3 text-base">
            Order Now -&nbsp; from{" "}
            <span className="line-through opacity-60">{`$${originalFrom.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>{" "}
            {`$${discountedFrom(originalFrom)}`}{" "}
            <span className="text-green-200 text-sm font-semibold">10% off</span>
          </Link>

          <CryptoIcons text="Pay with crypto or credit card" />
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="border-t border-border" />
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto px-6 py-12 pb-16 space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Where will my ad appear?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              On the Trending Bar for all tokens on the same chain as your token, rotated randomly along with up to 5 other advertisers
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">How long will my ad stay up?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              You can pick an ad package ranging from 24 hours up to 1 week
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Will my token be trending on DEX Screener?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ads help boost your token's <a href="https://dexscreener.com" className="text-foreground underline hover:no-underline">Trending Score</a>, but it does not in any way guarantee that your token will trend on DEX Screener
            </p>
          </div>

          {/* How does it work */}
          <div className="pt-8">
            <div className="border-t border-border mb-12" />
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How does it work?</h2>
            <div className="flex flex-col items-center gap-10 text-center max-w-2xl mx-auto">
              <div>
                <div className="w-10 h-10 rounded-full bg-muted-foreground/30 text-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold">1</div>
                <h3 className="font-semibold text-foreground mb-1">Tell us about your token</h3>
                <p className="text-sm text-muted-foreground">All we need is token address, symbol and image</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-muted-foreground/30 text-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold">2</div>
                <h3 className="font-semibold text-foreground mb-1">Pay</h3>
                <p className="text-sm text-muted-foreground">Pick a package and budget that works for you. All major cryptocurrencies and credit/debit cards accepted</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-muted-foreground/30 text-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold">3</div>
                <h3 className="font-semibold text-foreground mb-1">Wait for processing</h3>
                <p className="text-sm text-muted-foreground">Most orders are processed within just a few minutes!</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-muted-foreground/30 text-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold">✓</div>
                <h3 className="font-semibold text-foreground mb-1">Done!</h3>
                <p className="text-sm text-muted-foreground">Your ad will start running on the DEX Screener website!</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-4">
            <Link to="/product/trending-bar-ad/order" className="btn-learn-more px-8 py-3 text-base">
              Order Now -&nbsp; from{" "}
              <span className="line-through opacity-60">{`$${originalFrom.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>{" "}
              {`$${discountedFrom(originalFrom)}`}{" "}
              <span className="text-green-200 text-sm font-semibold">10% off</span>
            </Link>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default TrendingBarProduct;
