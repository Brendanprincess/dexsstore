import { Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";

const TokenInfoProduct = () => {
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      {/* Hero section */}
      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Enhanced Token Info</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Enhanced Token Info
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Quickly update your DEX Screener token page with accurate and up-to-date info and socials
          </p>

          {/* CTA Button */}
          <Link
            to="/product/token-info/order"
            className="btn-learn-more px-8 py-3 text-base"
          >
            Order Now -&nbsp; <span className="line-through opacity-60">$499.00</span>&nbsp; $299.00
          </Link>

          {/* Crypto icons */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="text-lg text-muted-foreground">◎</span>
            <span className="text-lg text-muted-foreground">⟠</span>
            <span className="text-lg text-muted-foreground">◆</span>
            <span className="text-lg text-muted-foreground">₿</span>
            <span className="text-lg text-muted-foreground">💳</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Pay with crypto or credit card</p>
        </div>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-t border-border" />
        </div>

        {/* Content section */}
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Update your token info with DEX Screener directly to{" "}
            <strong className="text-foreground">grow your community</strong> and{" "}
            <strong className="text-foreground">stand out from the crowd</strong>!
          </p>
        </div>

        {/* Feature preview area */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="rounded-xl bg-secondary/50 p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">✓ Custom Token Logo</h3>
                <p className="text-xs text-muted-foreground">Your logo displayed prominently on the token listing page</p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">✓ Project Description</h3>
                <p className="text-xs text-muted-foreground">Add a detailed description of your token project</p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">✓ Website & Socials</h3>
                <p className="text-xs text-muted-foreground">Link your website, Twitter, Telegram, and Discord</p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">✓ Verified Badge</h3>
                <p className="text-xs text-muted-foreground">Gain a verified badge to build trust with traders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default TokenInfoProduct;
