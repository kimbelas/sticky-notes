import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: "NoteSpace - Collaborative Sticky Notes | Real-time Digital Workspace",
  description:
    "Create, share, and collaborate on sticky notes in real-time. NoteSpace is your digital workspace for brainstorming, planning, and organizing ideas with your team. No signup required!",
  keywords: "sticky notes, collaborative notes, digital workspace, online sticky notes, team collaboration, brainstorming tool, note sharing, real-time notes, virtual whiteboard, productivity tool",
  authors: [{ name: "NoteSpace Team" }],
  creator: "NoteSpace",
  publisher: "NoteSpace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://notespace.app'),
  openGraph: {
    title: "NoteSpace - Collaborative Sticky Notes",
    description: "Create and share sticky notes instantly. Perfect for brainstorming, planning, and organizing ideas with your team.",
    url: '/',
    siteName: 'NoteSpace',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NoteSpace - Collaborative Sticky Notes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "NoteSpace - Collaborative Sticky Notes",
    description: "Create and share sticky notes instantly. Perfect for brainstorming and planning.",
    images: ['/twitter-image.png'],
  },
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
