export interface ApiResponse<T = unknown> {
	data: T | null;
	error: string | null;
	timestamp: string;
}

export function createApiResponse<T>(
	data: T | null,
	error: string | null = null,
): ApiResponse<T> {
	return {
		data,
		error,
		timestamp: new Date().toISOString(),
	};
}

export function formatApiError(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return "Unknown error occurred";
}
