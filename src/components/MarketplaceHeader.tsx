import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface MarketplaceHeaderProps {
  showBack?: boolean;
}

const MarketplaceHeader = ({ showBack = false }: MarketplaceHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container max-w-3xl mx-auto flex items-center justify-between py-3 px-4">
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
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-xs">DX</span>
            </div>
            <span className="font-semibold text-sm text-foreground">
              DEX Screener
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
