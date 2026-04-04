import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import SmoothScroll from "@/components/layout/SmoothScroll";
import LayoutShell from "@/components/layout/LayoutShell";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Premium Jewelry | E-Commerce",
  description: "A luxury jewelry brand website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${cormorant.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex flex-col bg-background text-foreground selection:bg-gold selection:text-black min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <LayoutShell>
                    {children}
                  </LayoutShell>
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
