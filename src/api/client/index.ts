import axios from 'axios'

/**
 * Axios instance used for all API calls.
 * baseURL is configured via VITE_API_URL environment variable.
 * All API calls go through MSW in dev/test/prod build.
 */
const baseURL: string = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Re-throw so TanStack Query can handle retries
    const err = error instanceof Error ? error : new Error(String(error))
    return Promise.reject(err)
  },
)
