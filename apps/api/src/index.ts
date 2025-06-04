import Fastify from "fastify";
import {
  createApiResponse,
  formatApiError,
} from "@fastify-react-router-starter/shared-utils";
import {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  type Todo,
} from "@fastify-react-router-starter/database";

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

// Todo CRUD endpoints
fastify.get("/api/todos", async () => {
  try {
    const todos = await getTodos();
    return createApiResponse(todos);
  } catch (error) {
    return createApiResponse(null, formatApiError(error));
  }
});

fastify.post<{ Body: { title: string } }>("/api/todos", async (request) => {
  try {
    const { title } = request.body;
    if (!title?.trim()) {
      return createApiResponse(null, "Title is required");
    }
    const todo = await createTodo(title.trim());
    return createApiResponse(todo);
  } catch (error) {
    return createApiResponse(null, formatApiError(error));
  }
});

fastify.patch<{ Params: { id: string } }>(
  "/api/todos/:id/toggle",
  async (request) => {
    try {
      const { id } = request.params;
      const todo = await toggleTodo(id);
      return createApiResponse(todo);
    } catch (error) {
      return createApiResponse(null, formatApiError(error));
    }
  }
);

fastify.delete<{ Params: { id: string } }>(
  "/api/todos/:id",
  async (request) => {
    try {
      const { id } = request.params;
      await deleteTodo(id);
      return createApiResponse({ success: true });
    } catch (error) {
      return createApiResponse(null, formatApiError(error));
    }
  }
);

// CORS support for the web app
fastify.register(import("@fastify/cors"), {
  origin: ["http://localhost:5173", "http://localhost:3000"], // Common Vite/React dev ports
  credentials: true,
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 API Server ready at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
