import ThemeToggleSwitch from "./components/ThemeToggleSwitch";
import "./globals.css";
import Providers from "./providers";
import "mapbox-gl/dist/mapbox-gl.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-100/80 dark:bg-zinc-800">
        <Providers>
          <ThemeToggleSwitch />
          {children}
        </Providers>
      </body>
    </html>
  );
}
