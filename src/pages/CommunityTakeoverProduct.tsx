import { Link } from "react-router-dom";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import Breadcrumb from "@/components/Breadcrumb";
import CryptoIcons from "@/components/CryptoIcons";

const CommunityTakeoverProduct = () => {
  const original = 199;
  const discounted = (value: number) => (value * 0.9).toFixed(2);
  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 text-center">
          <Breadcrumb items={[{ label: "Token Community Takeover" }]} />

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Token Community Takeover
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Add a Community Takeover Claim to a project with an existing profile
          </p>

          <Link
            to="/product/token-community-takeover/order"
            className="btn-learn-more px-8 py-3 text-base"
          >
            Order Now -&nbsp;{" "}
            <span className="line-through opacity-60">{`$${original.toFixed(2)}`}</span>{" "}
            {`$${discounted(original)}`}{" "}
            <span className="text-green-200 text-sm font-semibold">10% off</span>
          </Link>

          <CryptoIcons text="Pay with crypto or credit card" />
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default CommunityTakeoverProduct;
