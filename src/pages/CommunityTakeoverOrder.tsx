import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageUpload from "@/components/ImageUpload";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import MarketplaceFooter from "@/components/MarketplaceFooter";
import Breadcrumb from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendTelegramNotification } from "@/lib/telegram";
import ChainSelect from "@/components/ChainSelect";

const LINK_BUTTONS = [
  { key: "website", label: "Add Website" },
  { key: "docs", label: "Add Docs" },
  { key: "x", label: "Add X" },
  { key: "telegram", label: "Add Telegram" },
  { key: "discord", label: "Add Discord" },
  { key: "tiktok", label: "Add Tiktok" },
  { key: "instagram", label: "Add Instagram" },
  { key: "reddit", label: "Add Reddit" },
  { key: "farcaster", label: "Add Farcaster" },
];

const CommunityTakeoverOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chain, setChain] = useState(searchParams.get("chainId") || "");
  const [tokenAddress, setTokenAddress] = useState(searchParams.get("tokenAddress") || "");
  const [tokenValid, setTokenValid] = useState(!!searchParams.get("tokenAddress"));

  const [description, setDescription] = useState("");
  const [takeoverClaim, setTakeoverClaim] = useState("");

  const [links, setLinks] = useState<Record<string, string>>({});
  const [activeLinkFields, setActiveLinkFields] = useState<string[]>([]);
  const [additionalLinks, setAdditionalLinks] = useState<string[]>([]);
  const [lockedAddresses, setLockedAddresses] = useState<string[]>([]);
  const [supplyDescription, setSupplyDescription] = useState("");

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);

  const toggleLinkField = (key: string) => {
    if (activeLinkFields.includes(key)) {
      setActiveLinkFields(activeLinkFields.filter((k) => k !== key));
      const newLinks = { ...links };
      delete newLinks[key];
      setLinks(newLinks);
      sendTelegramNotification(`<b>User Action:</b> Removed link field <b>${key}</b> (Community Takeover)`);
    } else {
      setActiveLinkFields([...activeLinkFields, key]);
      sendTelegramNotification(`<b>User Action:</b> Added link field <b>${key}</b> (Community Takeover)`);
    }
  };

  const handleTokenAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTokenAddress(val);
    setTokenValid(val.length > 20);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chain || !tokenAddress || !check1 || !check2 || !check3) return;

    sendTelegramNotification(`
<b>Order Form Submitted: Community Takeover</b>
-------------------------
<b>Chain:</b> ${chain}
<b>Token Address:</b> <code>${tokenAddress}</code>
<b>Price:</b> $199.00
<b>Description:</b> ${description || "N/A"}
<b>Takeover Claim:</b> ${takeoverClaim || "N/A"}
<b>Links:</b> ${JSON.stringify(links)}
-------------------------
<i>User is moving to payment page...</i>
    `);

    navigate("/payment", {
      state: {
        service: "Token Community Takeover",
        price: 199.00,
        details: { chain, tokenAddress, description, takeoverClaim, links, additionalLinks, lockedAddresses, supplyDescription },
      },
    });
  };

  return (
    <div className="min-h-screen bg-page-gradient">
      <MarketplaceHeader />

      <div className="bg-hero-glow">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 text-center">
          <Breadcrumb items={[
            { label: "Token Community Takeover", to: "/product/token-community-takeover" },
            { label: "Order" },
          ]} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2">
            Token Community Takeover
          </h1>
        </div>

        <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Requirements section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Requirements</h2>
            <p className="text-muted-foreground mb-4">Checklist of major requirements that may fast track the approval:</p>
            <ul className="text-muted-foreground space-y-2 mb-6 list-disc list-inside">
              <li>Ownership of socials on file can be proven</li>
              <li>The new Telegram group is pinned in the old Telegram group</li>
              <li>The current socials on file are completely dead (inaccessible/defunct)</li>
              <li>The current socials on file are a blatant scam or are no longer used for community purposes of the token (we will need clear proof)</li>
            </ul>
            <p className="text-foreground font-semibold mb-4">In case none of the above requirements are met, here are a few other things that we will be looking at:</p>
            <ul className="text-muted-foreground space-y-2 mb-6 list-disc list-inside">
              <li>The state of the current community: Has there been any recent activity? Are any of the channels muted/locked (for example only buybot spam)?</li>
              <li>How does the size of the new community compare to the old community?</li>
            </ul>
            <p className="text-foreground leading-relaxed">
              Please note that some tokens were not meant to have a community other than what was listed on the original profile. We may not approve the Community Takeover in such cases.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Chain */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Chain</h2>
              <ChainSelect
                value={chain}
                onValueChange={(val) => {
                  setChain(val);
                  sendTelegramNotification(`<b>User Action:</b> Selected chain <b>${val}</b> (Community Takeover)`);
                }}
              />
            </div>

            {/* Token Address */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Token Address</h2>
              <Input
                value={tokenAddress}
                onChange={handleTokenAddressChange}
                onBlur={() => {
                  if (tokenAddress) {
                    sendTelegramNotification(`<b>User Action:</b> Input Token Address (Community Takeover): <code>${tokenAddress}</code>`);
                  }
                }}
                placeholder=""
                className="bg-secondary border-border text-foreground"
              />
              {tokenValid && tokenAddress && (
                <p className="flex items-center gap-2 text-[hsl(142,70%,55%)] text-sm mt-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Community Takeover Claim can be purchased for this token!
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">Description</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Project description. Plain text only. Emojis and multilines allowed. Description will be displayed on the pair details page on DEX Screener.
              </p>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => {
                  if (description) {
                    sendTelegramNotification(`<b>User Action:</b> Input Description (Community Takeover): "${description.substring(0, 100)}..."`);
                  }
                }}
                placeholder=""
                className="bg-secondary border-border text-foreground min-h-[150px]"
              />
            </div>

            {/* Takeover Claim */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">Takeover Claim</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Please provide a short explanation for why the community is taking over this project. This explanation will be displayed on DEX Screener.
              </p>
              <Textarea
                value={takeoverClaim}
                onChange={(e) => setTakeoverClaim(e.target.value)}
                onBlur={() => {
                  if (takeoverClaim) {
                    sendTelegramNotification(`<b>User Action:</b> Input Takeover Claim (Community Takeover): "${takeoverClaim.substring(0, 100)}..."`);
                  }
                }}
                placeholder=""
                className="bg-secondary border-border text-foreground min-h-[150px]"
              />
            </div>

            {/* Links */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Links</h2>
              <div className="grid grid-cols-2 gap-3">
                {LINK_BUTTONS.map((btn) => (
                  <div key={btn.key}>
                    {activeLinkFields.includes(btn.key) ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground font-medium">{btn.label.replace("Add ", "")}</span>
                          <button type="button" onClick={() => toggleLinkField(btn.key)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
                        </div>
                        <Input
                          value={links[btn.key] || ""}
                          onChange={(e) => setLinks({ ...links, [btn.key]: e.target.value })}
                          onBlur={() => {
                            if (links[btn.key]) {
                              sendTelegramNotification(`<b>User Action:</b> Input ${btn.key} link: <code>${links[btn.key]}</code>`);
                            }
                          }}
                          placeholder=""
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleLinkField(btn.key)}
                        className="w-full rounded-lg border border-border bg-secondary text-foreground text-sm font-medium py-5 hover:border-muted-foreground transition-colors"
                      >
                        {btn.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional links */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Additional links</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Please provide additional links that don't fit into the above categories. For example, links to other social media profiles.
              </p>
              {additionalLinks.map((link, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    value={link}
                    onChange={(e) => {
                      const updated = [...additionalLinks];
                      updated[i] = e.target.value;
                      setAdditionalLinks(updated);
                    }}
                    onBlur={() => {
                      if (link) {
                        sendTelegramNotification(`<b>User Action:</b> Input additional link: <code>${link}</code>`);
                      }
                    }}
                    className="bg-secondary border-border text-foreground"
                  />
                  <button type="button" onClick={() => {
                    setAdditionalLinks(additionalLinks.filter((_, j) => j !== i));
                    sendTelegramNotification(`<b>User Action:</b> Removed additional link index ${i}`);
                  }} className="text-muted-foreground hover:text-foreground px-2">✕</button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAdditionalLinks([...additionalLinks, ""]);
                  sendTelegramNotification(`<b>User Action:</b> Clicked "Add link" (Community Takeover)`);
                }}
                className="border border-border bg-transparent text-foreground rounded-lg px-5 py-2 text-sm hover:bg-secondary transition-colors"
              >
                Add link
              </button>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Images</h2>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Icon</h3>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside">
                  <li>1:1 aspect ratio (square, for example <code className="text-muted-foreground">100x100</code>px or <code className="text-muted-foreground">500x500</code>px)</li>
                  <li>min. image width: 100px</li>
                  <li>support formats: png, jpg, webp and gif</li>
                  <li>max. file size: 4.5MB</li>
                </ul>
                <ImageUpload onFileSelect={(file) => {
                  console.log("Icon:", file.name);
                  sendTelegramNotification(`<b>User Action:</b> Uploaded Icon: <code>${file.name}</code> (Community Takeover)`);
                }} label="No file chosen" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Header</h3>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside">
                  <li>3:1 aspect ratio (rectangle, for example <code className="text-muted-foreground">600x200</code>px or <code className="text-muted-foreground">1500x500</code>px)</li>
                  <li>min. image width: 600px</li>
                  <li>support formats: png, jpg, webp and gif</li>
                  <li>max. file size: 4.5MB</li>
                </ul>
                <ImageUpload onFileSelect={(file) => {
                  console.log("Header:", file.name);
                  sendTelegramNotification(`<b>User Action:</b> Uploaded Header: <code>${file.name}</code> (Community Takeover)`);
                }} label="No file chosen" />
              </div>
            </div>

            {/* Locked Supply */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                Locked Supply <span className="text-muted-foreground font-normal text-base">(Optional)</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-2 mb-4 leading-relaxed">
                Locked Supply refers to the portion of a cryptocurrency's total supply that is not available for trading or circulation. These tokens are often held in reserve for future use, such as development, partnerships, or team incentives. <strong className="text-foreground">Not to be confused with Locked Liquidity.</strong>
              </p>

              <h3 className="text-lg font-bold text-foreground mb-2">Locked Addresses</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Provide an <strong className="text-foreground">optional</strong> list of addresses with locked tokens. You <strong className="text-foreground">don't</strong> need to include the following burn addresses, we check them automatically:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc list-inside font-mono">
                <li>0x0000000000000000000000000000000000000000</li>
                <li>0x0000000000000000000000000000000000000001</li>
                <li>0x000000000000000000000000000000000000dead</li>
                <li>0xdead000000000000000000000000000000000000</li>
              </ul>
              {lockedAddresses.map((addr, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    value={addr}
                    onChange={(e) => {
                      const updated = [...lockedAddresses];
                      updated[i] = e.target.value;
                      setLockedAddresses(updated);
                    }}
                    onBlur={() => {
                      if (addr) {
                        sendTelegramNotification(`<b>User Action:</b> Input locked address: <code>${addr}</code>`);
                      }
                    }}
                    className="bg-secondary border-border text-foreground font-mono"
                  />
                  <button type="button" onClick={() => {
                    setLockedAddresses(lockedAddresses.filter((_, j) => j !== i));
                    sendTelegramNotification(`<b>User Action:</b> Removed locked address index ${i}`);
                  }} className="text-muted-foreground hover:text-foreground px-2">✕</button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setLockedAddresses([...lockedAddresses, ""]);
                  sendTelegramNotification(`<b>User Action:</b> Clicked "Add address" (Community Takeover)`);
                }}
                className="border border-border bg-transparent text-foreground rounded-lg px-5 py-2 text-sm hover:bg-secondary transition-colors mb-6"
              >
                Add address
              </button>

              <h3 className="text-lg font-bold text-foreground mb-3 mt-4">Supply Description</h3>
              <Textarea
                value={supplyDescription}
                onChange={(e) => setSupplyDescription(e.target.value)}
                onBlur={() => {
                  if (supplyDescription) {
                    sendTelegramNotification(`<b>User Action:</b> Input supply description: "${supplyDescription.substring(0, 100)}..."`);
                  }
                }}
                placeholder=""
                className="bg-secondary border-border text-foreground min-h-[120px]"
              />
              <p className="text-sm text-muted-foreground mt-2">Provide a brief explanation of why and how supply is locked</p>
            </div>

            {/* Order summary */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Order summary</h2>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex justify-between px-4 py-3 text-sm text-muted-foreground border-b border-border">
                  <span>Product</span>
                  <span>Price</span>
                </div>
                <div className="px-4 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-foreground font-medium">Token Community Takeover</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ETA: Submission will be verified by DEX Screener. Average processing time after receiving payment is less than 12 hours.
                      </p>
                    </div>
                    <span className="text-foreground font-medium whitespace-nowrap ml-4">
                      <span className="line-through text-muted-foreground mr-2">$499.00</span>$199.00
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={check1} onChange={(e) => {
                  setCheck1(e.target.checked);
                  sendTelegramNotification(`<b>User Action:</b> ${e.target.checked ? "Checked" : "Unchecked"} Agreement 1 (Community Takeover)`);
                }} className="mt-1 accent-primary" />
                <span className="text-sm text-foreground font-medium">
                  I understand that I am paying for the <strong className="text-foreground font-bold underline">review</strong> of the takeover claim. It does not guarantee approval.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={check2} onChange={(e) => {
                  setCheck2(e.target.checked);
                  sendTelegramNotification(`<b>User Action:</b> ${e.target.checked ? "Checked" : "Unchecked"} Agreement 2 (Community Takeover)`);
                }} className="mt-1 accent-primary" />
                <span className="text-sm text-foreground font-medium">
                  I understand that I will not be refunded if the Community Takeover is rejected.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={check3} onChange={(e) => {
                  setCheck3(e.target.checked);
                  sendTelegramNotification(`<b>User Action:</b> ${e.target.checked ? "Checked" : "Unchecked"} Agreement 3 (Community Takeover)`);
                }} className="mt-1 accent-primary" />
                <span className="text-sm text-foreground font-medium">
                  I understand that all supplied data must be verifiable through official channels such as website and socials.
                </span>
              </label>
            </div>

            <p className="text-sm text-foreground">
              By completing this purchase, I confirm that I've read and agree to the{" "}
              <a href="https://docs.dexscreener.com/privacy/refund-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">Refund Policy</a>.
            </p>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!chain || !tokenAddress || !check1 || !check2 || !check3}
                className="btn-learn-more px-10 py-3 text-base disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Order Now
              </button>
            </div>
          </form>
        </div>
      </div>

      <MarketplaceFooter />
    </div>
  );
};

export default CommunityTakeoverOrder;
