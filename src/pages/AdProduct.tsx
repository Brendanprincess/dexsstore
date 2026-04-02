import { Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import Breadcrumb from "@/components/Breadcrumb";
import CryptoIcons from "@/components/CryptoIcons";

const AdProduct = () => {
  const discountedFrom = (value: number) => (value * 0.9).toFixed(2);
  const originalFrom = 299;
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 text-center">
          <Breadcrumb items={[{ label: "Token Advertising" }]} />

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Token Advertising
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Advertise your token on DEX Screener and give it the exposure it deserves
          </p>

          <Link to="/product/ad/order" className="btn-learn-more px-8 py-3 text-base">
            Order Now -&nbsp; from{" "}
            <span className="line-through opacity-60">{`$${originalFrom.toFixed(2)}`}</span>{" "}
            {`$${discountedFrom(originalFrom)}`}{" "}
            <span className="text-green-200 text-sm font-semibold">10% off</span>
          </Link>

          <CryptoIcons text="Pay with crypto" />
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="border-t border-border" />
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Put that marketing budget to good use and get your token in front of{" "}
            <strong className="text-foreground">millions of people</strong>!
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6 pb-16 space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">The best (and easiest) way to showcase your token to the world!</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your project's logo and socials can be displayed on DEX Screener front and center, so traders can easily spot and interact with it!
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Fits any budget</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Starts at just $299 - no surprises, know upfront exactly how many impressions your banner will get and renew at any time!
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Your community will love it!</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We'll let them know you have an active ad campaign on DEX Screener
            </p>
          </div>

          <div className="pt-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">How does it work?</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 text-sm font-bold">1</div>
                <h3 className="font-semibold text-foreground mb-1">Tell us about your token</h3>
                <p className="text-sm text-muted-foreground">All we need is token address, description and links</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 text-sm font-bold">2</div>
                <h3 className="font-semibold text-foreground mb-1">Pay</h3>
                <p className="text-sm text-muted-foreground">Pick a budget that works for you. All major cryptocurrencies and credit/debit cards accepted</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 text-sm font-bold">3</div>
                <h3 className="font-semibold text-foreground mb-1">Wait for processing</h3>
                <p className="text-sm text-muted-foreground">Most orders are processed within just a few minutes!</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3 text-sm font-bold">✓</div>
                <h3 className="font-semibold text-foreground mb-1">Done!</h3>
                <p className="text-sm text-muted-foreground">Your ad will start running on the DEX Screener website and apps!</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link to="/product/ad/order" className="btn-learn-more px-8 py-3 text-base">
              Order Now -&nbsp; from{" "}
              <span className="line-through opacity-60">{`$${originalFrom.toFixed(2)}`}</span>{" "}
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

export default AdProduct;
