import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ApiLoadingHandler } from "@/components/common/ApiLoadingHandler";
import StoreProvider from "@/components/providers/StoreProvider";
import ReduxAuthProvider from "@/components/providers/ReduxAuthProvider";
import dynamic from "next/dynamic";
import "./globals.css";

const AppInitializer = dynamic(() => import("@/app/app-init"), { ssr: false });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata = {
  title: "SeeU Cafe Admin",
  description: "Administrative dashboard for SeeU Cafe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body>
        <StoreProvider>
          <AppInitializer />
          <ReactQueryProvider>
            <LoadingProvider>
              <ReduxAuthProvider>
                <ApiLoadingHandler />
                {children}
                <Toaster position="top-right" />
              </ReduxAuthProvider>
            </LoadingProvider>
          </ReactQueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
