const resolveFnUrl = (envOverride: string | undefined, relativeFnPath: string) => {
  if (envOverride && /^https?:/i.test(envOverride)) return envOverride;
  if (typeof window === "undefined") return relativeFnPath;
  const rawBaseUrl: string = (import.meta.env as unknown as { BASE_URL?: string }).BASE_URL || "/";
  const isRelativeBase = /^\./.test(rawBaseUrl);
  const cleanSubpath = isRelativeBase
    ? ""
    : rawBaseUrl.replace(/\/$/, "");
  const base = window.location.origin + cleanSubpath;
  const path = relativeFnPath.startsWith("/") ? relativeFnPath : `/${relativeFnPath}`;
  return `${base}${path}`;
};

const TELEGRAM_NOTIFY_URL = resolveFnUrl(
  import.meta.env.VITE_TELEGRAM_NOTIFY_URL,
  ".netlify/functions/telegram-notify"
);

export const sendTelegramNotification = async (message: string) => {
  if (!TELEGRAM_NOTIFY_URL) {
    console.warn(
      "[Telegram] Notification URL missing (VITE_TELEGRAM_NOTIFY_URL). Notification skipped. " +
      "Make sure VITE_TELEGRAM_NOTIFY_URL is set to your Netlify function URL, e.g. " +
      "https://your-site.netlify.app/.netlify/functions/telegram-notify"
    );
    return;
  }

  console.log("[Telegram] Sending notification to:", TELEGRAM_NOTIFY_URL);

  try {
    const response = await fetch(TELEGRAM_NOTIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        parseMode: "HTML",
      }),
    });

    let responseBody = "";
    try {
      responseBody = await response.text();
    } catch {
      // Intentionally ignored: response body read failure is non-critical
    }

    console.log(
      `[Telegram] Response status: ${response.status} ${response.statusText}`,
      responseBody ? `| Body: ${responseBody}` : ""
    );

    if (!response.ok) {
      throw new Error(
        `Telegram API error: ${response.status} ${response.statusText}${responseBody ? " - " + responseBody : ""}`
      );
    }

    console.log("[Telegram] Notification sent successfully!");
  } catch (error) {
    console.error("[Telegram] Failed to send notification:", error);
  }
};
