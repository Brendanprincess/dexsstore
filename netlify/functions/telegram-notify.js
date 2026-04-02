const pickOrigin = (originHeader, allowedOrigins) => {
  if (!originHeader) return null;
  if (!allowedOrigins || allowedOrigins.length === 0) return null;
  return allowedOrigins.includes(originHeader) ? originHeader : null;
};

exports.handler = async (event) => {
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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: origin ? 204 : 403, headers, body: "" };
  }

  if (!origin) {
    return { statusCode: 403, headers, body: JSON.stringify({ ok: false }) };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false }) };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false }) };
  }

  const message = typeof payload.message === "string" ? payload.message : "";
  const parseMode = typeof payload.parseMode === "string" ? payload.parseMode : "HTML";

  if (!message) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false }) };
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
