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

/** 解析非 2xx 响应为 ApiError，优先取响应体中的 message 字段 */
async function toApiError(response: Response): Promise<ApiError> {
  let message = response.statusText
  try {
    const body: unknown = await response.json()
    if (typeof body === 'object' && body !== null && 'message' in body) {
      message = String((body as { message: unknown }).message)
    }
  } catch {
    // 非 JSON 错误响应，保留 statusText
  }
  return new ApiError(response.status, message)
}

/**
 * 发起 GET 请求并解析 JSON 响应。
 *
 * @param path - 接口路径，如 `/api/forum/topics`
 * @param query - 查询参数对象；`undefined` 与空字符串的字段会被忽略
 * @returns 解析后的响应体，类型由调用方约定
 * @throws {ApiError} 响应非 2xx 时抛出，message 取自响应体或 statusText
 */
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
    throw await toApiError(response)
  }
  return (await response.json()) as T
}

/**
 * 发起 POST 请求并解析 JSON 响应。
 *
 * @param path - 接口路径，如 `/api/challenges`
 * @param body - 请求体对象，将序列化为 JSON；不需要请求体时可省略
 * @returns 解析后的响应体，类型由调用方约定
 * @throws {ApiError} 响应非 2xx 时抛出，message 取自响应体或 statusText
 */
export async function post<T>(path: string, body?: object): Promise<T> {
  const response = await fetch(new URL(path, window.location.origin), {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!response.ok) {
    throw await toApiError(response)
  }
  return (await response.json()) as T
}
