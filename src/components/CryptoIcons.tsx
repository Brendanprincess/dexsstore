const CryptoIcons = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center gap-2 mt-6">
      <div className="flex items-center gap-3">
        {/* SOL */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">◎</text>
        </svg>
        {/* ETH */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">⟠</text>
        </svg>
        {/* USDT */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">$</text>
        </svg>
        {/* BTC */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">₿</text>
        </svg>
        {/* Card */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-muted-foreground" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      </div>
      <p className="text-xs text-muted-foreground">{text}</p>
    </div>
  );
};

export default CryptoIcons;
