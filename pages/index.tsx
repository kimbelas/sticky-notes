import { GetServerSideProps } from 'next';
import Head from 'next/head';
import CodeEntry from '../components/CodeEntry';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>NoteSpace - Create or Join a Collaborative Workspace</title>
        <meta name="description" content="Start collaborating instantly! Create a new workspace or join an existing one with a simple room code. No signup, no hassle - just pure productivity." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="create workspace, join room, collaborative notes, instant access, no signup, team workspace" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="NoteSpace - Create or Join a Collaborative Workspace" />
        <meta property="og:description" content="Start collaborating instantly! Create a new workspace or join an existing one." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NoteSpace - Instant Collaboration" />
        <meta name="twitter:description" content="Create and share sticky notes instantly. No signup required!" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="/" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <CodeEntry />
    </>
  );
}

// No server-side props needed for the landing page
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};