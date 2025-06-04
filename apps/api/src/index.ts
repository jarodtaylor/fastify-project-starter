import Fastify from "fastify";
import {
  createApiResponse,
  formatApiError,
} from "@fastify-react-router-starter/shared-utils";

const fastify = Fastify({
  logger: true,
});

// Health check endpoint
fastify.get("/health", async () => {
  return createApiResponse({ status: "ok" });
});

// Hello world endpoint
fastify.get("/api/hello", async (request) => {
  try {
    const name = (request.query as { name?: string }).name || "World";
    const responseData = {
      message: `Hello, ${name}!`,
      version: "1.0.0",
    };
    return createApiResponse(responseData);
  } catch (error) {
    return createApiResponse(null, formatApiError(error));
  }
});

// CORS support for the web app
fastify.register(import("@fastify/cors"), {
  origin: ["http://localhost:5173", "http://localhost:3000"], // Common Vite/React dev ports
  credentials: true,
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 API Server ready at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
