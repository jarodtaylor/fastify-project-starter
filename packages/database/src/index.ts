import { PrismaClient } from "@prisma/client";

// Create global instance to prevent multiple connections in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Export Prisma namespace for types
export { Prisma } from "@prisma/client";

// Export the model type from the client instance
export type Todo = Awaited<ReturnType<typeof prisma.todo.findFirst>>;

// Utility functions can be added here later
export const getTodos = () => prisma.todo.findMany();
export const createTodo = (title: string) =>
  prisma.todo.create({ data: { title } });
export const toggleTodo = (id: string) =>
  prisma.todo.update({
    where: { id },
    data: { completed: { not: true } },
  });
export const deleteTodo = (id: string) => prisma.todo.delete({ where: { id } });
 