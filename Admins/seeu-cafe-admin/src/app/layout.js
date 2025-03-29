// app/layout.js
import localFont from "next/font/local";
import { Toaster } from 'react-hot-toast';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ApiLoadingHandler } from '@/components/common/ApiLoadingHandler';
import { Provider } from 'react-redux';
import { store } from '@/store';
import "./globals.css";

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
      <Provider store={store}>
          <ReactQueryProvider>
            <LoadingProvider>
              <ApiLoadingHandler />
              {children}
              <Toaster position="top-right" />
            </LoadingProvider>
            </ReactQueryProvider>
            </Provider>
      </body>
    </html>
  );
}