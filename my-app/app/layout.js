import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: "Digital Editorial - Social AI Platform",
  description: "Curating the future of social connection with AI.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${plusJakartaSans.variable} ${inter.variable} dark h-full antialiased`}
      >
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </head>
        <body className="bg-background text-on-background font-body min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
