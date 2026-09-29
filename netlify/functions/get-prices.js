const normalizeOrigin = (originHeader) => {
  if (!originHeader) return null;
  try {
    const u = new URL(originHeader);
    return u.origin;
  } catch {
    return originHeader.replace(/\/+$/, "").toLowerCase();
  }
};

const matchOrigin = (originHeader, allowedOrigins) => {
  const normalized = normalizeOrigin(originHeader);
  if (!normalized) return null;
  if (!allowedOrigins || allowedOrigins.length === 0) {
    return normalized;
  }
  for (const raw of allowedOrigins) {
    const a = normalizeOrigin(raw);
    if (!a) continue;
    if (a === normalized) return normalized;
    try {
      const wildcardHost = a.replace(/^\*\./, "");
      if (a.startsWith("*.") && normalized.endsWith("." + wildcardHost)) return normalized;
    } catch {
      // ignore
    }
    if (raw === "*") return normalized;
  }
  return null;
};

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana,matic-network,avalanche-2&vs_currencies=usd";

const COINPAPRIKA_URL =
  "https://api.coinpaprika.com/v1/tickers/eth-ethereum,sol-solana,matic-polygon,avax-avalanche?quotes=USD";

const BINANCE_SYMBOLS = ["ETHUSDT", "SOLUSDT", "MATICUSDT", "AVAXUSDT"];
const BINANCE_URL =
  "https://api.binance.com/api/v3/ticker/price?symbols=" +
  encodeURIComponent(JSON.stringify(BINANCE_SYMBOLS));

const OKX_INSTS = ["ETH-USDT", "SOL-USDT", "MATIC-USDT", "AVAX-USDT"];
const OKX_URL =
  "https://www.okx.com/api/v5/market/tickers?instType=SPOT&instId=" + OKX_INSTS.join(",");

const REQUIRED = ["ETH", "SOL", "POL", "AVAX"];

const isRecord = (v) => v && typeof v === "object" && !Array.isArray(v);
const numOrNull = (v) => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const merge = (target, patch, sourceName) => {
  const next = { ...target };
  let updated = 0;
  for (const k of REQUIRED) {
    if (typeof next[k] !== "number") {
      const v = numOrNull(patch[k]);
      if (v !== null) {
        next[k] = v;
        updated++;
      }
    }
  }
  console.log(`[get-prices] merge(${sourceName}): +${updated} prices →`, next);
  return next;
};

const complete = (obj) => REQUIRED.every((k) => typeof obj[k] === "number");

const fetchJSON = async (url, label, timeoutMs, extraHeaders = {}) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "dexsstore-netlify-function/1.0",
        ...extraHeaders,
      },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) {
      console.log(`[get-prices] ${label}: HTTP ${res.status}`);
      return null;
    }
    const txt = await res.text();
    try {
      return JSON.parse(txt);
    } catch (parseErr) {
      console.log(`[get-prices] ${label}: JSON parse failed`);
      return null;
    }
  } catch (err) {
    console.log(`[get-prices] ${label}: fetch error: ${err.message}`);
    return null;
  } finally {
    clearTimeout(t);
  }
};

const tryCoinGecko = async (prices) => {
  const d = await fetchJSON(COINGECKO_URL, "CoinGecko", 4000);
  if (!isRecord(d)) return prices;
  return merge(prices, {
    ETH: d.ethereum?.usd,
    SOL: d.solana?.usd,
    POL: d["matic-network"]?.usd,
    AVAX: d["avalanche-2"]?.usd,
  }, "CoinGecko");
};

const tryCoinPaprika = async (prices) => {
  const arr = await fetchJSON(COINPAPRIKA_URL, "CoinPaprika", 5000);
  if (!Array.isArray(arr)) return prices;
  const patch = {};
  for (const row of arr) {
    if (!isRecord(row)) continue;
    const id = row.id;
    const price = row?.quotes?.USD?.price;
    if (id === "eth-ethereum") patch.ETH = price;
    else if (id === "sol-solana") patch.SOL = price;
    else if (id === "matic-polygon") patch.POL = price;
    else if (id === "avax-avalanche") patch.AVAX = price;
  }
  return merge(prices, patch, "CoinPaprika");
};

const tryBinance = async (prices) => {
  const rows = await fetchJSON(BINANCE_URL, "Binance", 4000);
  const patch = {};
  const list = Array.isArray(rows) ? rows : isRecord(rows) && rows.symbol ? [rows] : null;
  if (!list) return prices;
  for (const row of list) {
    if (!isRecord(row)) continue;
    const sym = String(row.symbol || "");
    const p = numOrNull(row.price);
    if (sym === "ETHUSDT") patch.ETH = p;
    else if (sym === "SOLUSDT") patch.SOL = p;
    else if (sym === "MATICUSDT") patch.POL = p;
    else if (sym === "AVAXUSDT") patch.AVAX = p;
  }
  return merge(prices, patch, "Binance");
};

const tryOkx = async (prices) => {
  const d = await fetchJSON(OKX_URL, "OKX", 5000);
  const patch = {};
  const list = isRecord(d) && Array.isArray(d.data) ? d.data : null;
  if (!list) return prices;
  for (const row of list) {
    if (!isRecord(row)) continue;
    const inst = String(row.instId || "");
    const p = numOrNull(row.last);
    if (inst === "ETH-USDT") patch.ETH = p;
    else if (inst === "SOL-USDT") patch.SOL = p;
    else if (inst === "MATIC-USDT") patch.POL = p;
    else if (inst === "AVAX-USDT") patch.AVAX = p;
  }
  return merge(prices, patch, "OKX");
};

export const handler = async (event) => {
  console.log("[get-prices] Request received. Method:", event.httpMethod);

  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const originHeader = event.headers?.origin || event.headers?.Origin;
  const matchedOrigin = matchOrigin(originHeader, allowed);

  const acao = matchedOrigin || "*";
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": acao,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Vary": "Origin",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: "method_not_allowed" }) };
  }

  try {
    let prices = {};
    const sourcesTried = [];

    for (const step of [
      { name: "CoinGecko", run: tryCoinGecko },
      { name: "CoinPaprika", run: tryCoinPaprika },
      { name: "Binance", run: tryBinance },
      { name: "OKX", run: tryOkx },
    ]) {
      if (complete(prices)) break;
      sourcesTried.push(step.name);
      try {
        prices = await step.run(prices);
      } catch (stepErr) {
        console.log(`[get-prices] step ${step.name} threw: ${stepErr.message}`);
      }
    }

    const finalPrices = { USDC: 1, ...prices };

    const missing = REQUIRED.filter((k) => typeof finalPrices[k] !== "number");
    if (missing.length > 0) {
      console.error("[get-prices] Missing prices after chain:", missing, "tried:", sourcesTried.join(","));
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          ok: false,
          error: "missing_prices",
          missing,
          sourcesTried,
          partial: finalPrices,
        }),
      };
    }

    console.log("[get-prices] Chain done. Final prices:", finalPrices, "sourcesTried:", sourcesTried);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        prices: finalPrices,
        fetchedAt: Date.now(),
        sourcesTried,
      }),
    };
  } catch (err) {
    console.error("[get-prices] Top-level chain error:", err.message, err.stack);
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        ok: false,
        error: "network_error",
        details: err.message,
      }),
    };
  }
};
