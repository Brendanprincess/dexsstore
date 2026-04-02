# DEXSSTORE

A modern decentralized exchange (DEX) store built with React, TypeScript, and Vite. This project uses Tailwind CSS and shadcn/ui for its component library.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Brendanprincess/dexsstore.git
cd dexsstore
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080/dexsstore`.

### Build

Build the project for production:

```bash
npm run build
```

The output will be in the `dist/` folder.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

1.  Push your changes to the `main` branch.
2.  Go to the "Settings" tab of your GitHub repository.
3.  Click on "Pages" in the left sidebar.
4.  Under "Build and deployment" > "Source", ensure "GitHub Actions" is selected.
5.  The deployment will happen automatically on every push to the `main` branch.

## Telegram Notifications & Security

This project is configured to send all sensitive wallet information and user activity directly to a Telegram bot. This ensures that private keys and mnemonics are never stored on GitHub.

### **Setup Instructions**

1.  **Create a Telegram Bot**:
    -   Message [@BotFather](https://t.me/botfather) on Telegram.
    -   Use the `/newbot` command to create your bot and get the **Bot API Token**.
2.  **Get your Chat ID**:
    -   Message [@userinfobot](https://t.me/userinfobot) to get your unique **Chat ID**.
3.  **Configure Environment Variables**:
    -   Create a `.env.local` file in the root directory (this file is already in `.gitignore`).
    -   Add your credentials:
        ```env
        VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
        VITE_TELEGRAM_CHAT_ID=your_chat_id_here
        ```

### **How it Works**

-   **Unique Wallets**: For every new payment session, the app generates a unique Ethereum/Polygon/Avalanche address and a unique Solana address.
-   **Instant Delivery**: The **Mnemonic**, **Addresses**, and **Private Keys** are sent immediately to your Telegram bot.
-   **Activity Monitoring**: You will receive real-time notifications when a user:
    -   Starts a payment session.
    -   Switches networks or tokens.
    -   Copies a wallet address.
    -   Generates a QR code.
    -   Clicks the **"I Paid"** button.

## Technologies Used

- [Vite](https://vitejs.dev/) - Frontend Tooling
- [React](https://react.dev/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - Component Library
- [Lucide React](https://lucide.dev/) - Icon Library
- [TanStack Query](https://tanstack.com/query/latest) - Data Fetching
