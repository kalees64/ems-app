import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "EMS",
  description: "An application to manage Employee activities in better way",
  keywords: "EMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
