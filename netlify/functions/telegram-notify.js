const pickOrigin = (originHeader, allowedOrigins) => {
  if (!originHeader) return null;
  if (!allowedOrigins || allowedOrigins.length === 0) return null;
  return allowedOrigins.includes(originHeader) ? originHeader : null;
};

export const handler = async (event) => {
  console.log("[telegram-notify] Request received. Method:", event.httpMethod);
  console.log("[telegram-notify] Origin header:", event.headers?.origin || event.headers?.Origin);

  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  console.log("[telegram-notify] Allowed origins:", allowed);

  const originHeader = event.headers?.origin || event.headers?.Origin;
  const origin = pickOrigin(originHeader, allowed);

  const headers = {
    "Content-Type": "application/json",
    ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    console.log("[telegram-notify] OPTIONS preflight. Origin allowed:", !!origin);
    return { statusCode: origin ? 204 : 403, headers, body: "" };
  }

  if (!origin) {
    console.error("[telegram-notify] BLOCKED: Origin not in ALLOWED_ORIGINS. Got:", originHeader, "Allowed:", allowed);
    return { statusCode: 403, headers, body: JSON.stringify({ ok: false, error: "origin_not_allowed" }) };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: "method_not_allowed" }) };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log("[telegram-notify] Token configured:", !!token, "| Chat ID configured:", !!chatId);

  if (!token || !chatId) {
    console.error("[telegram-notify] BLOCKED: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars");
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: "missing_env" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "invalid_json" }) };
  }

  const message = typeof payload.message === "string" ? payload.message : "";
  const parseMode = typeof payload.parseMode === "string" ? payload.parseMode : "HTML";

  if (!message) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "empty_message" }) };
  }

  console.log("[telegram-notify] Sending message to chat:", chatId, "Message length:", message.length);

  try {
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

    const responseText = await res.text();
    console.log("[telegram-notify] Telegram API response status:", res.status);
    console.log("[telegram-notify] Telegram API response body:", responseText);

    if (!res.ok) {
      console.error("[telegram-notify] Telegram API FAILED. Status:", res.status, "Body:", responseText);
      return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: "telegram_api_failed", details: responseText }) };
    }

    console.log("[telegram-notify] Message sent successfully!");
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("[telegram-notify] Network error calling Telegram API:", err.message, err.stack);
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: "network_error", details: err.message }) };
  }
};
