import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const MarketplaceHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between py-3 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-7 h-7" />
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
