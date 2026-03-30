import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface MarketplaceHeaderProps {
  showBack?: boolean;
}

const MarketplaceHeader = ({ showBack = false }: MarketplaceHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border glass sticky top-0 z-50">
      <div className="container max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">DX</span>
            </div>
            <span className="font-display font-semibold text-lg text-foreground">
              DEX Marketplace
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <a href="mailto:support@dexmarketplace.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
