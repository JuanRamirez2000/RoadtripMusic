import ThemeToggleSwitch from "./components/ThemeToggleSwitch";
import "./globals.css";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeToggleSwitch />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
