import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'GitHub Streak Stats Generator | Open Source README Add-on',
  description: 'Generate beautiful, customizable, and animated SVG cards for your GitHub README. Display your streak, total contributions, top languages, and GitHub rank instantly.',
  keywords: ['github streak', 'github stats', 'readme stats', 'github rank', 'github profile builder', 'svg stats', 'github top languages', 'devencoder'],
  authors: [{ name: 'Asadullah Shahbaz', url: 'https://github.com/Asadullah-shz' }],
  creator: 'Asadullah Shahbaz',
  publisher: 'Asadullah Shahbaz',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://github-streak-stats.vercel.app',
    languages: {
      'en-US': 'https://github-streak-stats.vercel.app',
    },
  },
  openGraph: {
    title: 'GitHub Streak Stats Generator | Open Source',
    description: 'Generate beautiful, customizable, and animated SVG cards for your GitHub README.',
    url: 'https://github-streak-stats.vercel.app',
    siteName: 'GitHub Streak Stats',
    images: [
      {
        url: 'https://github-streak-stats.vercel.app/api/streak?user=torvalds&theme=dracula',
        width: 1200,
        height: 630,
        alt: 'GitHub Streak Stats Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Streak Stats',
    description: 'Beautiful, animated SVG stats for your GitHub profile.',
    images: ['https://github-streak-stats.vercel.app/api/streak?user=torvalds&theme=dracula'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GitHub Streak Stats Generator',
    description: 'Generate beautiful, customizable SVG cards for your GitHub README showing your streak, contributions, top languages, and GitHub rank.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Person',
      name: 'Asadullah Shahbaz',
      url: 'https://github.com/Asadullah-shz'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FAFAFA] text-slate-900 min-h-screen flex flex-col antialiased selection:bg-blue-100" suppressHydrationWarning>
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
              </svg>
              Streak Stats
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-slate-900 transition-colors">Generator</Link>
              <Link href="/themes" className="hover:text-slate-900 transition-colors">Themes</Link>
              <Link href="/deploy" className="hover:text-slate-900 transition-colors">Deploy Guide</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>

       
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 mt-12">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
           <p className="pointer-events-auto inline-block">
            <a href="https://github.com/Asadullah-shz">Created with ❤️ by Asadullah Shahbaz</a>
          </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">Thanks for Usage</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
