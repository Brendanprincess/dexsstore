const TELEGRAM_NOTIFY_URL = import.meta.env.VITE_TELEGRAM_NOTIFY_URL;

export const sendTelegramNotification = async (message: string) => {
  if (!TELEGRAM_NOTIFY_URL) {
    console.warn("Telegram notification URL missing (VITE_TELEGRAM_NOTIFY_URL). Notification skipped.");
    return;
  }

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

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
};
