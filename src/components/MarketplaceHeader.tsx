import { Link } from "react-router-dom";

const MarketplaceHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between py-3 px-6">
        <Link to="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L15 35V65L50 90L85 65V35L50 10Z" fill="none" stroke="hsl(199 89% 48%)" strokeWidth="4"/>
            <path d="M50 20L25 40V60L50 80L75 60V40L50 20Z" fill="hsl(199 89% 48% / 0.15)" stroke="hsl(199 89% 48%)" strokeWidth="2"/>
            <path d="M40 45L50 55L65 38" stroke="hsl(199 89% 48%)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-foreground">DEX Screener</span>
          <span className="text-muted-foreground">Marketplace</span>
        </Link>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Sign In
        </button>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
