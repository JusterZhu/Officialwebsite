import "./globals.css";
import LenisProvider from "./providers/LenisProvider";

export const metadata = {
  title: "TSLH Enterprise",
  description: "A premium enterprise homepage with cinematic scroll image sequence animation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
