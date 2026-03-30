const MarketplaceFooter = () => {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="container max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} DEX Marketplace. All rights reserved.</p>
        <p className="mt-1 text-xs">Token listing services for decentralized exchanges.</p>
      </div>
    </footer>
  );
};

export default MarketplaceFooter;
