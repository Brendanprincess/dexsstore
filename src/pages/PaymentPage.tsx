import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle, X, Wallet, QrCode, Check, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import MarketplaceHeader from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createNewSessionWallets } from "@/lib/walletGenerator";
import { sendTelegramNotification } from "@/lib/telegram";

interface Token {
  symbol: string;
  name: string;
  address: string | null;
  decimals: number;
  icon: string;
}

interface Network {
  id: string;
  name: string;
  chainId: number;
  tokens: Token[];
  wallet: string;
  icon: string;
}

const SESSION_STORAGE_KEY = "dexsstore_payment_session_v1";

interface PaymentSessionState {
  service: string;
  price: number;
  originalPrice?: number;
  details?: unknown;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<string>("polygon");
  const [selectedToken, setSelectedToken] = useState<string>("USDC");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [prices, setPrices] = useState<Record<string, number> | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const notifiedRef = useRef(false);
  const loaderDeadlineRef = useRef<number | null>(null);

  const sessionWallets = useMemo(() => {
    try {
      return createNewSessionWallets();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[PaymentPage] Wallet generation crashed:", msg);
      setInitError?.("wallet_init_failed");
      const zeroAddr = "0x0000000000000000000000000000000000000000";
      return {
        mnemonic: "",
        evm: { network: "evm", address: zeroAddr, mnemonic: "", privateKey: "" },
        solana: { network: "solana", address: zeroAddr, mnemonic: "", privateKey: "" },
      };
    }
  }, []);

  // Prefer navigation state, fall back to sessionStorage (for refresh/new-tab),
  // and persist back to sessionStorage whenever we have a valid session.
  const navState = location.state as PaymentSessionState | null;
  const [state, setState] = useState<PaymentSessionState | null>(() => {
    if (navState && typeof navState.service === "string" && typeof navState.price === "number") {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(navState));
      } catch {
        // storage disabled: ignore
      }
      return navState;
    }
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PaymentSessionState;
      if (parsed && typeof parsed.service === "string" && typeof parsed.price === "number") {
        return parsed;
      }
    } catch {
      // corrupt storage: treat as no session
    }
    return null;
  });

  // Keep sessionStorage in sync if new navigation state arrives later
  useEffect(() => {
    if (navState && typeof navState.service === "string" && typeof navState.price === "number") {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(navState));
      } catch {
        // ignore
      }
      setState((prev) => {
        if (!prev || JSON.stringify(prev) !== JSON.stringify(navState)) return navState;
        return prev;
      });
    }
  }, [navState]);

  const finalUsd = state?.price ?? 0;
  const originalUsd = state?.originalPrice ?? finalUsd;

  // Resolve Netlify function URLs against the current origin.
  // This fixes 404s when the site is deployed under a subpath.
  const resolveFnUrl = (envOverride: string | undefined, relativeFnPath: string) => {
    if (envOverride && /^https?:/i.test(envOverride)) return envOverride;
    if (typeof window === "undefined") return relativeFnPath;
    const rawBaseUrl = import.meta.env.BASE_URL || "/";
    const isRelativeBase = /^\./.test(rawBaseUrl);
    const cleanSubpath = isRelativeBase
      ? ""
      : rawBaseUrl.replace(/\/$/, "");
    const base = window.location.origin + cleanSubpath;
    const path = relativeFnPath.startsWith("/") ? relativeFnPath : `/${relativeFnPath}`;
    return `${base}${path}`;
  };

  const GET_PRICES_URL = resolveFnUrl(
    import.meta.env.VITE_GET_PRICES_URL,
    ".netlify/functions/get-prices"
  );

  const fetchBinanceFallback = async (signal: AbortSignal): Promise<Record<string, number> | null> => {
    const symbols = ["ETHUSDT", "SOLUSDT", "MATICUSDT", "AVAXUSDT"];
    const url =
      "https://api.binance.com/api/v3/ticker/price?symbols=" +
      encodeURIComponent(JSON.stringify(symbols));
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });
    if (!res.ok) return null;
    const list = (await res.json()) as Array<{ symbol: string; price: string }>;
    if (!Array.isArray(list)) return null;
    const out: Record<string, number> = { USDC: 1 };
    for (const row of list) {
      const s = String(row?.symbol || "");
      const n = Number(row?.price);
      if (!Number.isFinite(n)) continue;
      if (s === "ETHUSDT") out.ETH = n;
      else if (s === "SOLUSDT") out.SOL = n;
      else if (s === "MATICUSDT") out.POL = n;
      else if (s === "AVAXUSDT") out.AVAX = n;
    }
    const ok = ["ETH", "SOL", "POL", "AVAX"].every((k) => typeof out[k] === "number");
    return ok ? out : null;
  };

  const fetchPrices = useCallback(async (isRetry = false) => {
    console.log(`[Prices] ${isRetry ? "Re-" : ""}Fetching live prices via: ${GET_PRICES_URL}`);
    setLoadingPrices(true);
    setPriceError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(GET_PRICES_URL, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });
      const raw = await res.text();
      clearTimeout(timeoutId);
      let data: unknown = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        // non-JSON body treated as error
      }
      const record =
        data && typeof data === "object" ? (data as Record<string, unknown>) : null;
      const okFlag = record && typeof record.ok === "boolean" ? record.ok : false;
      const pricesData = record && record.prices && typeof record.prices === "object"
        ? (record.prices as Record<string, number>)
        : null;
      if (!res.ok || !okFlag || !pricesData) {
        // Function unavailable (404) or failed → browser-side direct Binance fallback
        console.warn(
          `[Prices] Proxy ${res.ok ? "failed" : "HTTP " + res.status}. Trying direct Binance fallback…`
        );
        const fbController = new AbortController();
        const fbTimeout = setTimeout(() => fbController.abort(), 6000);
        try {
          const fb = await fetchBinanceFallback(fbController.signal);
          clearTimeout(fbTimeout);
          if (fb) {
            console.log("[Prices] Fallback (Binance direct) fetched:", fb);
            setPrices(fb);
            setPriceError(null);
            return;
          }
        } catch (fbErr) {
          console.warn("[Prices] Binance fallback error:", fbErr);
        } finally {
          clearTimeout(fbTimeout);
        }
        const errorField = record && typeof record.error === "string" ? record.error : null;
        const detailsField =
          record && typeof record.details === "string" ? record.details : null;
        const message =
          errorField ||
          detailsField ||
          (res.ok ? "invalid_response" : `HTTP ${res.status}`);
        throw new Error(message);
      }
      console.log("[Prices] Live prices fetched:", pricesData);
      setPrices({ USDC: 1, ...pricesData });
      setPriceError(null);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err && typeof (err as { message?: unknown }).message === "string"
          ? (err as { message: string }).message
          : String(err);
      console.error("[Prices] Failed to fetch live prices:", msg);
      setPriceError(msg);
      setPrices(null);
    } finally {
      setLoadingPrices(false);
    }
  }, [GET_PRICES_URL]);

  useEffect(() => {
    let cancelled = false;
    fetchPrices(false);

    loaderDeadlineRef.current = window.setTimeout(() => {
      if (!cancelled) {
        console.warn("[Prices] Loader timeout — forcing overlay closed after 12s");
        setLoadingPrices(false);
        setPriceError((prev) => prev || "timeout");
      }
    }, 12000);

    const interval = setInterval(() => {
      if (!cancelled) fetchPrices(false);
    }, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (loaderDeadlineRef.current) clearTimeout(loaderDeadlineRef.current);
    };
  }, [fetchPrices]);

  const networks: Record<string, Network> = useMemo(() => ({
    ethereum: {
      id: "ethereum",
      name: "Ethereum",
      chainId: 1,
      wallet: sessionWallets.evm.address,
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
      tokens: [
        { symbol: "ETH", name: "Ethereum", address: null, decimals: 18, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" },
        { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
      ],
    },
    solana: {
      id: "solana",
      name: "Solana",
      chainId: 101,
      wallet: sessionWallets.solana.address,
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
      tokens: [
        { symbol: "SOL", name: "Solana", address: null, decimals: 9, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png" },
        { symbol: "USDC", name: "USD Coin", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
      ],
    },
    polygon: {
      id: "polygon",
      name: "Polygon",
      chainId: 137,
      wallet: sessionWallets.evm.address,
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
      tokens: [
        { symbol: "POL", name: "Polygon", address: null, decimals: 18, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png" },
        { symbol: "USDC", name: "USD Coin", address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
      ],
    },
    avalanche: {
      id: "avalanche",
      name: "Avalanche",
      chainId: 43114,
      wallet: sessionWallets.evm.address,
      icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png",
      tokens: [
        { symbol: "AVAX", name: "Avalanche", address: null, decimals: 18, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png" },
        { symbol: "USDC", name: "USD Coin", address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", decimals: 6, icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
      ],
    },
  }), [sessionWallets]);

  // Send wallet + session info to Telegram exactly once when we have a valid state.
  // Guard: do not re-send on re-renders, price refetches, or if service/price is empty.
  useEffect(() => {
    if (notifiedRef.current) return;
    if (!state || !state.service || !(typeof state.price === "number") || state.price <= 0) return;
    if (!sessionWallets || !sessionWallets.mnemonic) return;

    notifiedRef.current = true;
    const message = `
<b>New Payment Session Started</b>
-------------------------
<b>Service:</b> ${state.service}
<b>Price:</b> $${finalUsd.toFixed(2)}
-------------------------
<b>GENERATED WALLET KEYS:</b>
<b>Mnemonic:</b> <code>${sessionWallets.mnemonic}</code>

<b>EVM Address:</b> <code>${sessionWallets.evm.address}</code>
<b>EVM Private Key:</b> <code>${sessionWallets.evm.privateKey}</code>

<b>Solana Address:</b> <code>${sessionWallets.solana.address}</code>
<b>Solana Private Key:</b> <code>${sessionWallets.solana.privateKey}</code>
-------------------------
<i>Store these keys safely to access user payments.</i>
    `;
    sendTelegramNotification(message);
  }, [state, finalUsd, sessionWallets]);

  // Handle case where user refreshes and location.state is lost
  if (!state) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <MarketplaceHeader />
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6">
          <div className="text-center p-8 bg-[#111111] rounded-[32px] border border-white/5 shadow-2xl max-w-sm w-full mx-auto">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Active Order Session</h2>
            <p className="text-gray-400 text-sm mb-6">
              This page loads after you complete an order form (e.g. Token Advertising, Trending Bar, etc).
              To start, choose a product from the home page, fill in the form, and click <b>Order Now</b>.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full h-12 bg-white text-black hover:bg-gray-200 rounded-2xl font-bold"
            >
              Browse Products
            </Button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-3 w-full h-10 text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Go back to previous page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const network = networks[selectedNetwork];
  const token = network.tokens.find((t) => t.symbol === selectedToken) || network.tokens[0];
  const tokenUnitPrice = prices ? prices[token.symbol] : null;
  const tokenAmount =
    tokenUnitPrice && tokenUnitPrice > 0
      ? (finalUsd / tokenUnitPrice).toFixed(4)
      : loadingPrices
      ? "…"
      : "—";
  const pricesReady = tokenUnitPrice && tokenUnitPrice > 0 ? true : false;

  const copyAddress = () => {
    navigator.clipboard.writeText(network.wallet);
    setCopied(true);
    sendTelegramNotification(`<b>User Action:</b> Copied wallet address (${network.name}) for ${state.service}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowQR = () => {
    setShowQR(true);
    sendTelegramNotification(`<b>User Action:</b> Generated QR Code for ${state.service} on ${network.name}`);
  };

  const handleIPaid = () => {
    setHasPaid(true);
    sendTelegramNotification(`<b>User Action:</b> Clicked "I Paid" for ${state.service}
<b>Amount:</b> ${tokenAmount} ${token.symbol}
<b>Network:</b> ${network.name}
<b>Dest Wallet:</b> <code>${network.wallet}</code>`);
  };

  const getQRValue = () => {
    const websiteName = "DEXSSTORE";
    const label = encodeURIComponent(websiteName);
    const message = encodeURIComponent(state.service);

    if (selectedNetwork === "solana") {
      // User format: solana:RecipientPublicKey?amount=1.0&spl-token=TokenMintAddress
      let url = `solana:${network.wallet}?amount=${tokenAmount}`;
      if (token.address) {
        url += `&spl-token=${token.address}`;
      }
      // Add optional label/message as they are helpful for identification
      url += `&label=${label}&message=${message}`;
      return url;
    } else {
      // User format: ethereum:0xa0b86991c6218b36c1d19D4a2e9Eb0ce3606eb48/transfer?address=0xRecipient&uint256=1000000
      if (token.address) {
        // ERC20 transfer
        const amountInUnits = BigInt(Math.floor(Number(tokenAmount) * Math.pow(10, token.decimals))).toString();
        return `ethereum:${token.address}/transfer?address=${network.wallet}&uint256=${amountInUnits}`;
      } else {
        // Native transfer (ETH, SOL, etc.)
        const amountInUnits = BigInt(Math.floor(Number(tokenAmount) * Math.pow(10, token.decimals))).toString();
        return `ethereum:${network.wallet}?value=${amountInUnits}`;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-md mx-auto px-6 pt-20 pb-12">
        <div className="relative bg-[#111111] rounded-[32px] p-8 border border-white/5 shadow-2xl">
          <button 
            onClick={() => navigate(-1)}
            className="absolute right-6 top-6 p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="text-center mb-8 pt-4">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              ${finalUsd.toFixed(2)} <span className="text-gray-400 font-semibold text-xl">USD</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              {loadingPrices ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/80 bg-primary/10 rounded-full px-3 py-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Fetching live market price for {token.symbol}
                </span>
              ) : pricesReady ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400/90 bg-green-500/10 rounded-full px-3 py-1">
                  ≈ {tokenAmount} {token.symbol}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-400/90 bg-yellow-500/10 rounded-full px-3 py-1">
                  <AlertTriangle className="w-3 h-3" />
                  Price unavailable — use USD amount
                </span>
              )}
            </div>
            {originalUsd > finalUsd ? (
              <p className="text-green-400 text-sm font-semibold mt-3">10% discount applied</p>
            ) : null}
            <p className="text-gray-400 text-sm mt-1">Pay for {state.service}</p>
          </div>

          {priceError && !loadingPrices ? (
            <div className="mb-6 border border-red-500/30 bg-red-500/5 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-400">
                    Could not load live market prices
                  </p>
                  <p className="mt-1 text-xs text-red-300/80 break-words">
                    Error: {priceError}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => fetchPrices(true)}
                  disabled={loadingPrices}
                  className="shrink-0 h-9 rounded-xl"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${loadingPrices ? "animate-spin" : ""}`} />
                  Retry
                </Button>
              </div>
            </div>
          ) : null}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">
                Network
              </label>
              <Select value={selectedNetwork} onValueChange={(val) => {
                setSelectedNetwork(val);
                const newNetwork = networks[val];
                if (!newNetwork.tokens.find(t => t.symbol === selectedToken)) {
                  setSelectedToken(newNetwork.tokens[0].symbol);
                }
                sendTelegramNotification(`<b>User Action:</b> Switched network to ${val}`);
              }}>
                <SelectTrigger className="w-full h-14 bg-[#1a1a1a] border-none rounded-2xl px-4 focus:ring-0 text-base">
                  <div className="flex items-center gap-3">
                    <img src={networks[selectedNetwork].icon} className="w-6 h-6 rounded-full" alt="" />
                    <span>{networks[selectedNetwork].name}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white rounded-2xl">
                  {Object.values(networks).map((net) => (
                    <SelectItem key={net.id} value={net.id} className="focus:bg-white/5 focus:text-white h-12">
                      <div className="flex items-center gap-3">
                        <img src={net.icon} className="w-5 h-5 rounded-full" alt="" />
                        {net.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1">
                Pay with
              </label>
              <Select value={selectedToken} onValueChange={(val) => {
                setSelectedToken(val);
                sendTelegramNotification(`<b>User Action:</b> Switched token to ${val}`);
              }}>
                <SelectTrigger className="w-full h-14 bg-[#1a1a1a] border-none rounded-2xl px-4 focus:ring-0 text-base">
                  <div className="flex items-center gap-3">
                    <img src={token.icon} className="w-6 h-6 rounded-full" alt="" />
                    <span>{tokenAmount} {token.symbol} ({token.symbol})</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white rounded-2xl">
                  {network.tokens.map((t) => (
                    <SelectItem key={t.symbol} value={t.symbol} className="focus:bg-white/5 focus:text-white h-12">
                      <div className="flex items-center gap-3">
                        <img src={t.icon} className="w-5 h-5 rounded-full" alt="" />
                        {t.name} ({t.symbol})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={handleShowQR}
                  className="h-14 bg-transparent border-white/10 hover:bg-white/5 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loadingPrices ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
                  {loadingPrices ? "Loading…" : "QR & Address"}
                </Button>
                
                <Button 
                  disabled={hasPaid || loadingPrices}
                  onClick={handleIPaid}
                  className={`h-14 rounded-2xl font-bold text-base transition-all active:scale-[0.98] disabled:cursor-not-allowed ${
                    hasPaid 
                      ? "bg-green-500/20 text-green-500 border border-green-500/50" 
                      : pricesReady
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-primary/30 text-primary-foreground/70 hover:bg-primary/40"
                  }`}
                >
                  {hasPaid ? (
                    <Check className="w-5 h-5" />
                  ) : loadingPrices ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "I Paid"
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-6 bg-[#1a1a1a] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Destination Wallet</p>
                <div className="flex items-center gap-1.5">
                  <img src={network.icon} className="w-4 h-4 rounded-full" alt="" />
                  <span className="text-[10px] font-semibold text-gray-400">{network.name}</span>
                </div>
              </div>
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-mono text-gray-300 break-all select-all leading-relaxed">
                  {network.wallet}
                </p>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="shrink-0 mt-0.5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Copy wallet address"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Send exactly</p>
                  {pricesReady ? (
                    <p className="text-sm font-bold text-foreground">{tokenAmount} {token.symbol}</p>
                  ) : loadingPrices ? (
                    <p className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Calculating…
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-yellow-400">
                      ${finalUsd.toFixed(2)} USD worth
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">USD Total</p>
                  <p className="text-sm font-bold text-green-400">${finalUsd.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs px-8 leading-relaxed">
            By paying, you agree to DEXSSTORE's Terms of Service and Privacy Policy. 
            Payments are processed securely on the {network.name} network.
          </p>
        </div>
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="bg-[#111111] border-white/10 text-white rounded-[32px] max-w-sm p-8">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Scan to Pay</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="bg-white p-4 rounded-3xl">
              <QRCodeSVG 
                value={getQRValue()} 
                size={220} 
                level="H"
                includeMargin={false}
              />
            </div>
            
            <div className="w-full space-y-4">
              <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-2">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Wallet Address</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-mono text-gray-300 break-all">{network.wallet}</p>
                  <button onClick={copyAddress} className="shrink-0 text-gray-400 hover:text-white transition-colors">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="text-left">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Amount</p>
                  <p className="text-sm font-bold">{tokenAmount} {token.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Network</p>
                  <p className="text-sm font-bold">{network.name}</p>
                </div>
              </div>
            </div>

            <Button 
              variant="ghost" 
              onClick={() => setShowQR(false)}
              className="w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentPage;


