// app/api/graphql.ts

import { ApolloServer } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { typeDefs } from '../../app/api/schemas';
import { resolvers } from '../../app/api/resolvers';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

// 🌍 MongoDB connection (run once)
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI || !MONGO_URI.startsWith('mongodb')) {
  throw new Error('Invalid MONGO_URI in .env.local');
}

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGO_URI, {
    dbName: 'StickyNotes',
  });
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const startServer = server.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await server.createHandler({ path: '/api/graphql' })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
