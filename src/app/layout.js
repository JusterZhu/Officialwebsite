import "./globals.css";
import LenisProvider from "./providers/LenisProvider";
import tslhLogo from "@/assets/images/tslhlogo.png";

export const metadata = {
  title: "TSLH AI",
  description: "Unlimited Updates, Boundless Upgrades.",
  icons: {
    icon: tslhLogo.src,
    shortcut: tslhLogo.src,
    apple: tslhLogo.src,
  },
  other: {
    "color-scheme": "dark",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
          <link rel="preload" href="/hero.mp4" as="video" type="video/mp4" fetchPriority="high" />
        </head>
        <body
          className="antialiased"
        >
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
