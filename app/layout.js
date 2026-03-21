import './globals.css';
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: 'Philippine Startup Intelligence',
  description: 'Real-time radar for PH tech startups and VC funding.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        {children}
        <Analytics />
      </body>
    </html>
  );
}