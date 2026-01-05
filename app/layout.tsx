import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
    title: 'AI Fitness Pal',
    description: 'Your AI-powered fitness companion',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased" suppressHydrationWarning>
                <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
