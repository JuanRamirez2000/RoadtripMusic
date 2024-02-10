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
      <body className="bg-slate-100 dark:bg-slate-800">
        <Providers>
          <ThemeToggleSwitch />
          {children}
        </Providers>
      </body>
    </html>
  );
}
