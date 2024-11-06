import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Caf Data by The Caf App",
  description: "A dashboard for historical rating data from The Caf App",

  keywords:
    "cafapp,caf,cafeteria,mississippi college,mc,the caf app,thecafapp,thecaf.app,mississippi,college"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
