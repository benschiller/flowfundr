import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Navbar from './components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "FlowFundr | Rental Income Tokenization",
  description: "Turn Future Rental Income Into Instant Capital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="container mt-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
