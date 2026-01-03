import useSWR from "swr"
import { demoClient } from "@/lib/demoClient"
import { Env } from "@/lib/storage"

export function useApiKeys(env: Env) {
  const { data, error, mutate } = useSWR(
    ["api-keys", env],
    () => demoClient.getApiKeys(env)
  )

  return {
    keys: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export function useWebhooks(env: Env) {
  const { data, error, mutate } = useSWR(
    ["webhooks", env],
    () => demoClient.getWebhooks(env)
  )

  return {
    webhooks: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export function useWebhookDeliveries(env: Env) {
  const { data, error, mutate } = useSWR(
    ["webhook-deliveries", env],
    () => demoClient.getWebhookDeliveries(env),
    { refreshInterval: 5000 } // Refresh deliveries every 5s
  )

  return {
    deliveries: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export function useEventLogs(env: Env) {
  const { data, error, mutate } = useSWR(
    ["event-logs", env],
    () => demoClient.getEventLogs(env),
    { refreshInterval: 5000 }
  )

  return {
    logs: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export function useSetupStatus(env: Env) {
  const { data, error, mutate } = useSWR(
    ["setup-status", env],
    () => demoClient.getSetupStatus(env)
  )

  return {
    status: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export function useCatalog(env: Env) {
  const { data, error, mutate } = useSWR(
    ["catalog", env],
    () => demoClient.getProducts(env)
  )

  return {
    products: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export function useOrders(env: Env) {
  const { data, error, mutate } = useSWR(
    ["orders", env],
    () => demoClient.getOrders(env),
    { refreshInterval: 10000 }
  )

  return {
    orders: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

export function useWalletSummary(env: Env, userId: string) {
  const { data, error, mutate } = useSWR(
    ["wallet-summary", env, userId],
    () => demoClient.getWalletSummary(env, userId)
  )

  return {
    summary: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
