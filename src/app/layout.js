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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
