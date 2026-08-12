export type { PagedResult } from '@/types/api'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function get<T>(path: string, query?: object): Promise<T> {
  const url = new URL(path, window.location.origin)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const response = await fetch(url)
  if (!response.ok) {
    let message = response.statusText
    try {
      const body: unknown = await response.json()
      if (typeof body === 'object' && body !== null && 'message' in body) {
        message = String((body as { message: unknown }).message)
      }
    } catch {
      // 非 JSON 错误响应，保留 statusText
    }
    throw new ApiError(response.status, message)
  }
  return (await response.json()) as T
}
