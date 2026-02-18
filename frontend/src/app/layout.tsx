// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { SocketProvider } from "@/context/SocketContext";
// import { ThemeProvider } from "@/contexts/ThemeContext";
// import { Toaster } from "react-hot-toast";
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "EDTECH - Master Tech Skills, Build Your Future",
//   description: "Learn from industry experts, build real projects, and get hired at top companies.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <ThemeProvider>
//           <SocketProvider>
//             <Toaster position="bottom-right" />
//             {children}
//           </SocketProvider>
//         </ThemeProvider>
//         <GoogleOAuthProvider clientId={process.env.       NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
//           {children}
//         </GoogleOAuthProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/context/SocketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EDTECH - Master Tech Skills, Build Your Future",
  description: "Learn from industry experts, build real projects, and get hired at top companies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <ThemeProvider>
            <AuthProvider>
              <SocketProvider>
                <Toaster position="bottom-right" />
                <AuthGuard>
                  {children}
                </AuthGuard>
              </SocketProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
