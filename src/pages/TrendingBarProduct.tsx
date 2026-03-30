import { Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";

const TrendingBarProduct = () => {
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Trending Bar Advertising</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Trending Bar Advertising
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Showcase your token among the top trending tokens on DEX Screener
          </p>

          <Link to="/product/trending-bar-ad/order" className="btn-learn-more px-8 py-3 text-base">
            Order Now -&nbsp; from $2,000.00
          </Link>

          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="text-lg text-muted-foreground">◎</span>
            <span className="text-lg text-muted-foreground">⟠</span>
            <span className="text-lg text-muted-foreground">◆</span>
            <span className="text-lg text-muted-foreground">₿</span>
            <span className="text-lg text-muted-foreground">💳</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Pay with crypto or credit card</p>
        </div>

        <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

        {/* Trending bar preview */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-card border border-border px-5 py-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Ad</span>
              <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center text-xs">₿</div>
              <span className="text-sm font-semibold text-foreground">BITCOIN</span>
            </div>
          </div>

          {/* Simulated trending bar */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="bg-secondary/80 px-4 py-2 flex items-center gap-4 text-xs overflow-x-auto">
              <span className="flex items-center gap-1.5 text-primary font-medium whitespace-nowrap">
                <span className="text-muted-foreground">Ad</span> 🪙 BITCOIN
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
                #1 🔷 ETHEREUM <span className="text-primary">2.30%</span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
                #2 ◎ SOLANA <span className="text-destructive">-0.20%</span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
                #3 🐕 DOGE <span className="text-destructive">-1.40%</span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
                #4 🐸 PEPE <span className="text-primary">4.20%</span>
              </span>
            </div>
            <div className="p-8 text-center">
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl mb-2">📈</p>
                  <p className="text-sm text-muted-foreground">Your token appears here in the trending bar</p>
                  <p className="text-xs text-muted-foreground mt-1">Visible to every user on the platform</p>
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

export default TrendingBarProduct;
