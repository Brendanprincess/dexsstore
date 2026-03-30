import { motion } from "framer-motion";
import { Shield, Megaphone, TrendingUp } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import ServiceCard from "@/components/ServiceCard";

const services = [
  {
    title: "Enhanced Token Info",
    description:
      "Add verified token details including logo, description, social links, and website to your token's listing page. Stand out from unverified tokens.",
    price: "$299.00",
    discountPrice: "$269.10",
    discount: "-10%",
    icon: Shield,
    href: "/product/token-info",
  },
  {
    title: "Token Advertising",
    description:
      "Promote your token with targeted banner ads displayed across token pages. Drive traffic and increase visibility for your project.",
    price: "From $500",
    icon: Megaphone,
    href: "/product/ad",
  },
  {
    title: "Trending Bar Ad",
    description:
      "Get your token featured in the trending bar at the top of the platform. Maximum visibility with millions of daily impressions.",
    price: "From $1,500",
    icon: TrendingUp,
    href: "/product/trending-bar-ad",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="container max-w-5xl mx-auto px-4 pt-20 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
              DEX Token <span className="text-gradient-primary">Marketplace</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Premium services to enhance your token's presence on decentralized exchange screeners.
              Verified info, advertising, and trending placements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="container max-w-5xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display text-2xl font-semibold mb-8 text-foreground"
        >
          Available Services
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} {...service} index={i} />
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <div className="rounded-xl border border-border bg-card p-8 shadow-card">
          <h2 className="font-display text-xl font-semibold mb-3 text-foreground">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold mb-2">1</div>
              <p>Select a service and fill in your token details including chain and contract address.</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold mb-2">2</div>
              <p>Choose your preferred payment chain (ETH, SOL, or BNB) and complete the payment.</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold mb-2">3</div>
              <p>Your order is processed and changes are applied within 24–48 hours.</p>
            </div>
          </div>
        </div>
      </section>

      <MarketplaceFooter />
    </div>
  );
};

export default Index;
