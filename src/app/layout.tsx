import type { Metadata } from "next";
import { Poppins,  } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";


// ====== FONT POPPINS I AM USING ======
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "Dashboard - Frontend Task",
  description: "Frontend Developer Task Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
