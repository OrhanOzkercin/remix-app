import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import Footer from "./components/footer";
import styles from "./styles/tailwind.css?url";
import Header from "./components/header";
import { FocusModeProvider } from "./contexts/focus-mode-context";
import { Toaster } from "./components/ui/toaster";
import { Analytics } from "@vercel/analytics/remix";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <FocusModeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </FocusModeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
