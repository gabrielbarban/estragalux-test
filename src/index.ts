import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  // Connect to MongoDB
  await connectDatabase();

  // Create Express app
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: express.Request }) => ({ req }),
    formatError: (error: any) => {
      console.error('GraphQL Error:', error);
      return error;
    }
  });

  // Start Apollo Server
  await server.start();

  // Apply middleware
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  // Health check endpoint
  app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 GraphQL Playground available at http://localhost:${PORT}/graphql`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await server.stop();
    process.exit(0);
  });
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}); 