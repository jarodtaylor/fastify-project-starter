import type { LoaderFunctionArgs } from "react-router";

interface ApiResponse {
  message: string;
  timestamp: string;
  version: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name") || undefined;

  try {
    const apiUrl = new URL("/api/hello", "http://localhost:3001");
    if (name) {
      apiUrl.searchParams.set("name", name);
    }

    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("Failed to fetch from API:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function meta() {
  return [
    { title: "Monorepo Demo" },
    { name: "description", content: "Fastify + React Router 7 Demo" },
  ];
}

export default function Home({
  loaderData,
}: {
  loaderData: { data: ApiResponse | null; error: string | null };
}) {
  const { data, error } = loaderData;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Monorepo Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Fastify API + React Router 7 + Turborepo
            </p>
          </div>

          {/* API Demo Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              API Integration Demo
            </h2>

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
                    <li>Open a new terminal</li>
                    <li>
                      Run:{" "}
                      <code className="bg-red-200 dark:bg-red-800 px-1 rounded">
                        cd apps/api && pnpm dev
                      </code>
                    </li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-4">
                  ✅ API Connected Successfully!
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Message:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {data?.message}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Version:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {data?.version}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Timestamp:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {data?.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Try with custom name */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Try with a custom name:
              </h4>
              <div className="flex gap-2">
                <a
                  href="?name=Developer"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Say Hello to Developer
                </a>
                <a
                  href="?name=World"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Default
                </a>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🔧 Backend
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Fastify API</li>
                <li>• TypeScript</li>
                <li>• Hot reload with tsx</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🎨 Frontend
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• React Router 7</li>
                <li>• Server-side rendering</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                ⚡ Tooling
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Turborepo</li>
                <li>• pnpm workspaces</li>
                <li>• Biome linting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
