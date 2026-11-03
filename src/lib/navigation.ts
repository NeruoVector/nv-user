import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

type Destination = string | { pathname: string; params?: Record<string, string | undefined> }

export function destinationUrl(destination: Destination): string {
  if (typeof destination === 'string') return destination
  const params = { ...destination.params }
  const pathname = destination.pathname.replace(/\[([^\]]+)\]/g, (_, key: string) => {
    const value = params[key]
    delete params[key]
    if (!value) throw new Error(`경로에 ${key} 값이 필요합니다.`)
    return encodeURIComponent(value)
  })
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, value)
  }
  return pathname + (query.size ? `?${query}` : '')
}

export function useAppRouter() {
  const navigate = useNavigate()
  return useMemo(() => ({
    push: (destination: Destination) => { void navigate(destinationUrl(destination)) },
    replace: (destination: Destination) => { void navigate(destinationUrl(destination), { replace: true }) },
    back: () => { if (window.history.state?.idx > 0) void navigate(-1); else void navigate('/shop', { replace: true }) },
  }), [navigate])
}

export function useAppParams<T extends Record<string, string | undefined>>() {
  const route = useParams()
  const [search] = useSearchParams()
  return { ...Object.fromEntries(search), ...route } as T
}
