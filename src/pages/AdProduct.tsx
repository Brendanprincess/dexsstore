import { Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";

const AdProduct = () => {
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Token Advertising</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Token Advertising
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Advertise your token on DEX Screener and give it the exposure it deserves
          </p>

          <Link to="/product/ad/order" className="btn-learn-more px-8 py-3 text-base">
            Order Now -&nbsp; from $299.00
          </Link>

          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="text-lg text-muted-foreground">◎</span>
            <span className="text-lg text-muted-foreground">⟠</span>
            <span className="text-lg text-muted-foreground">◆</span>
            <span className="text-lg text-muted-foreground">₿</span>
            <span className="text-lg text-muted-foreground">💳</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Pay with crypto</p>
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

        {/* Preview cards */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card/50 p-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">📊 Token Page Ad</h3>
              <p className="text-xs text-muted-foreground mb-3">Your token's ad displayed prominently on listing pages with custom branding</p>
              <div className="rounded-lg bg-secondary/50 p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-2 flex items-center justify-center text-xl">₿</div>
                <p className="text-sm font-semibold text-foreground">Your Token</p>
                <p className="text-xs text-muted-foreground">Ad Campaign Preview</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card/50 p-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">🚀 Marketing Boost</h3>
              <p className="text-xs text-muted-foreground mb-3">Get the marketing boost badge and increase your token's visibility</p>
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm">🪙</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Your Token / SOL</p>
                    <p className="text-xs text-muted-foreground">Solana • DEX</p>
                  </div>
                </div>
                <div className="rounded-md bg-primary/10 border border-primary/20 p-2 mt-2">
                  <p className="text-xs text-primary font-medium">🚀 Marketing Boost ⭐</p>
                  <p className="text-xs text-muted-foreground">This token is running an ad campaign!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default AdProduct;
