import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface MarketplaceHeaderProps {
  showBack?: boolean;
}

const MarketplaceHeader = ({ showBack = false }: MarketplaceHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-3 px-6">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold text-sm text-foreground">DEX Screener</span>
            <span className="text-sm text-muted-foreground">Marketplace</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
