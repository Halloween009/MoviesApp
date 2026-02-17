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
          <div className="flex gap-5 border-b-2 justify-center">
            <h2 className="text-5xl ">Movies DB</h2>
          </div>
          <NetworkStatus />
          {children}
        </GenreProvider>
      </body>
    </html>
  );
}
