import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Sticky Notes</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">📝</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            404
          </h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            Page Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="mr-2"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Back to Home
          </Link>
          
          <div className="mt-8 text-sm text-slate-500">
            <p>Looking for a specific room?</p>
            <p className="mt-1">Enter a 6-character room code on the home page</p>
          </div>
        </div>
      </div>
    </>
  );
}