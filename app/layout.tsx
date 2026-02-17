import "antd/dist/reset.css";
import "./globals.css";
import NetworkStatus from "@/component/NetworkStatus";
import { GenreProvider } from "./context/GenreContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GenreProvider>
          <NetworkStatus />
          {children}
        </GenreProvider>
      </body>
    </html>
  );
}
