import "./globals.css";

export const metadata = {
  title: "LTU Tabs Assignment",
  description: "Next.js app that outputs inline-CSS HTML tabs",
};

import ClientShell from "./components/ClientShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
        <a href="#main" style={{ position: "absolute", left: -9999 }}>Skip to content</a>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
