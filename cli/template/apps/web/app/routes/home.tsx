import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation } from "react-router";

interface Todo {
	id: string;
	title: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}

interface ApiResponse<T = unknown> {
	data: T | null;
	error: string | null;
	timestamp: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
	try {
		const response = await fetch("http://localhost:3000/api/todos");
		if (!response.ok) {
			throw new Error(`API responded with status: ${response.status}`);
		}

		const result: ApiResponse<Todo[]> = await response.json();
		return { todos: result.data || [], error: result.error };
	} catch (error) {
		console.error("Failed to fetch todos:", error);
		return {
			todos: [],
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent");

	try {
		if (intent === "create") {
			const title = formData.get("title") as string;
			const response = await fetch("http://localhost:3000/api/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title }),
			});
			if (!response.ok) throw new Error("Failed to create todo");
		} else if (intent === "toggle") {
			const id = formData.get("id") as string;
			const response = await fetch(
				`http://localhost:3000/api/todos/${id}/toggle`,
				{
					method: "PATCH",
				},
			);
			if (!response.ok) throw new Error("Failed to toggle todo");
		} else if (intent === "delete") {
			const id = formData.get("id") as string;
			const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete todo");
		}

		return { success: true };
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export function meta() {
	return [
		{ title: "Todo App - Monorepo Demo" },
		{ name: "description", content: "Fastify + React Router 7 Todo Demo" },
	];
}

export default function Home() {
	const { todos, error } = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-2xl mx-auto">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
							📝 Todo App Demo
						</h1>
						<p className="text-xl text-gray-600 dark:text-gray-300">
							Fastify API + React Router 7 + Prisma + SQLite
						</p>
					</div>

					{/* API Status */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
						{error ? (
							<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
								<h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
									❌ API Connection Failed
								</h3>
								<p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
								<div className="bg-red-100 dark:bg-red-900/40 rounded p-3">
									<p className="text-sm text-red-700 dark:text-red-300">
										<strong>To fix this:</strong>
									</p>
									<ol className="list-decimal list-inside text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
										<li>Make sure the API is running</li>
										<li>
											Run:{" "}
											<code className="bg-red-200 dark:bg-red-800 px-1 rounded">
												pnpm dev:api
											</code>
										</li>
										<li>Refresh this page</li>
									</ol>
								</div>
							</div>
						) : (
							<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
								<h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
									✅ Database Connected Successfully!
								</h3>
								<p className="text-green-700 dark:text-green-300">
									Found {todos.length} todo{todos.length !== 1 ? "s" : ""} in
									your SQLite database
								</p>
							</div>
						)}
					</div>

					{/* Add Todo Form */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
							Add New Todo
						</h2>
						<Form method="post" className="flex gap-3">
							<input type="hidden" name="intent" value="create" />
							<input
								type="text"
								name="title"
								placeholder="What needs to be done?"
								required
								disabled={isSubmitting}
								className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
							/>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{isSubmitting ? "Adding..." : "Add Todo"}
							</button>
						</Form>
					</div>

					{/* Todo List */}
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
							Your Todos
						</h2>

						{todos.length === 0 ? (
							<p className="text-gray-500 dark:text-gray-400 text-center py-8">
								No todos yet. Add one above to get started!
							</p>
						) : (
							<div className="space-y-3">
								{todos.map((todo) => (
									<div
										key={todo.id}
										className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
									>
										<Form method="post" className="flex-shrink-0">
											<input type="hidden" name="intent" value="toggle" />
											<input type="hidden" name="id" value={todo.id} />
											<button
												type="submit"
												disabled={isSubmitting}
												className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-blue-500 transition-colors"
												style={{
													backgroundColor: todo.completed
														? "#3b82f6"
														: "transparent",
													borderColor: todo.completed ? "#3b82f6" : undefined,
												}}
											>
												{todo.completed && (
													<svg
														className="w-3 h-3 text-white"
														fill="currentColor"
														viewBox="0 0 20 20"
														aria-hidden="true"
													>
														<path
															fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"
														/>
													</svg>
												)}
											</button>
										</Form>

										<span
											className={`flex-1 ${
												todo.completed
													? "line-through text-gray-500 dark:text-gray-400"
													: "text-gray-900 dark:text-white"
											}`}
										>
											{todo.title}
										</span>

										<Form method="post" className="flex-shrink-0">
											<input type="hidden" name="intent" value="delete" />
											<input type="hidden" name="id" value={todo.id} />
											<button
												type="submit"
												disabled={isSubmitting}
												className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
												title="Delete todo"
											>
												<svg
													className="w-5 h-5"
													fill="currentColor"
													viewBox="0 0 20 20"
													aria-hidden="true"
												>
													<path
														fillRule="evenodd"
														d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
														clipRule="evenodd"
													/>
												</svg>
											</button>
										</Form>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Tech Stack Info */}
					<div className="mt-8 grid md:grid-cols-2 gap-6">
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
								🔧 Backend Stack
							</h3>
							<ul className="space-y-2 text-gray-600 dark:text-gray-300">
								<li>• Fastify API</li>
								<li>• Prisma ORM</li>
								<li>• SQLite Database</li>
								<li>• TypeScript</li>
							</ul>
						</div>

						<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
								🎨 Frontend Stack
							</h3>
							<ul className="space-y-2 text-gray-600 dark:text-gray-300">
								<li>• React Router 7</li>
								<li>• Server-side rendering</li>
								<li>• Tailwind CSS</li>
								<li>• Form Actions</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
