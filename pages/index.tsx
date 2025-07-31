import { GetServerSideProps } from 'next';
import Head from 'next/head';
import CodeEntry from '../components/CodeEntry';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Sticky Notes - Room Access</title>
        <meta name="description" content="Access your shared sticky notes room" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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