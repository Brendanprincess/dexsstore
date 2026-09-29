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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(COINGECKO_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "dexsstore-netlify-function/1.0",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const responseText = await res.text();
    console.log("[get-prices] CoinGecko status:", res.status);

    if (!res.ok) {
      console.error("[get-prices] CoinGecko HTTP error:", res.status, responseText);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          ok: false,
          error: "coingecko_http_" + res.status,
          details: responseText.slice(0, 300),
        }),
      };
    }

    const data = JSON.parse(responseText);

    const prices = {
      ETH: data.ethereum?.usd,
      SOL: data.solana?.usd,
      POL: data["matic-network"]?.usd,
      AVAX: data["avalanche-2"]?.usd,
      USDC: 1,
    };

    console.log("[get-prices] Prices fetched:", prices);

    // Verify all non-USDC prices exist before returning success
    const missing = ["ETH", "SOL", "POL", "AVAX"].filter((k) => typeof prices[k] !== "number");
    if (missing.length > 0) {
      console.error("[get-prices] Missing prices for:", missing, "Raw data:", data);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          ok: false,
          error: "missing_prices",
          missing,
          raw: data,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, prices, fetchedAt: Date.now() }),
    };
  } catch (err) {
    console.error("[get-prices] Network/parse error:", err.message, err.stack);
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
