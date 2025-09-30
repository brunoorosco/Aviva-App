// http.ts
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

export class HttpError<T = unknown> extends Error {
  status: number
  data?: T
  constructor(message: string, status: number, data?: T) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

type Json = Record<string, unknown> | unknown[] | null

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: HeadersInit
  body?: unknown
  signal?: AbortSignal
}

async function parseBody<T>(res: Response): Promise<T | undefined> {
  if (res.status === 204) return undefined as T
  const ct = res.headers.get('content-type') ?? ''
  if (!ct.includes('application/json')) {
    const text = await res.text()
    // @ts-expect-error: permitir string caso não seja JSON
    return text as T
  }
  return (await res.json()) as T
}

export async function request<T = Json>(url: string, opts: RequestOptions = {}) {
  const { method = 'GET', headers, body, signal } = opts
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  const data = await parseBody<T>(res)

  if (!res.ok) {
    throw new HttpError(
      `HTTP ${res.status} ${res.statusText || ''}`.trim(),
      res.status,
      data
    )
  }

  return {
    data: data as T,
    status: res.status,
    headers: res.headers,
  }
}

// ---------- Hooks ----------

// GET com SWR (key = url)
export function useHttpGet<T = Json>(url?: string | null) {
  return useSWR<{ data: T; status: number; headers: Headers }>(
    url,
    (key, { signal }) => request<T>(key, { signal }),
    {
      // configs úteis:
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )
}

// Mutations com SWRMutation (POST/PATCH/PUT/DELETE)
type MutatorArg<B> = { url: string; body?: B; headers?: HeadersInit }

export function useHttpPost<TResp = Json, TBody = Json>() {
  return useSWRMutation<
    { data: TResp; status: number; headers: Headers },
    HttpError,
    string,               // chave (pode ser um namespace, ex: 'POST')
    MutatorArg<TBody>
  >('POST', (_, { arg, signal }) =>
    request<TResp>(arg.url, {
      method: 'POST',
      body: arg.body,
      headers: arg.headers,
      signal,
    })
  )
}

export function useHttpPatch<TResp = Json, TBody = Partial<Json>>() {
  return useSWRMutation('PATCH', (_, { arg, signal }) =>
    request<TResp>(arg.url, {
      method: 'PATCH',
      body: arg.body,
      headers: arg.headers,
      signal,
    })
  )
}

export function useHttpPut<TResp = Json, TBody = Json>() {
  return useSWRMutation('PUT', (_, { arg, signal }) =>
    request<TResp>(arg.url, {
      method: 'PUT',
      body: arg.body,
      headers: arg.headers,
      signal,
    })
  )
}

export function useHttpDelete<TResp = Json>() {
  return useSWRMutation('DELETE', (_, { arg, signal }) =>
    request<TResp>(arg.url, {
      method: 'DELETE',
      headers: arg.headers,
      signal,
    })
  )
}
