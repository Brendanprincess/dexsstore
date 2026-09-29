const pickOrigin = (originHeader, allowedOrigins) => {
  if (!originHeader) return null;
  if (!allowedOrigins || allowedOrigins.length === 0) return null;
  return allowedOrigins.includes(originHeader) ? originHeader : null;
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
  const origin = pickOrigin(originHeader, allowed);

  const headers = {
    "Content-Type": "application/json",
    ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: origin ? 204 : 403, headers, body: "" };
  }

  if (!origin) {
    console.error("[get-prices] BLOCKED: Origin not in ALLOWED_ORIGINS. Got:", originHeader);
    return { statusCode: 403, headers, body: JSON.stringify({ ok: false, error: "origin_not_allowed" }) };
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
