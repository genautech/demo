import { useState, useEffect } from "react"
import { Env } from "@/lib/storage"

export function useDemoState() {
  const [env, setEnv] = useState<Env>("sandbox")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const storedEnv = localStorage.getItem("yoobe_console_env") as Env
    if (storedEnv) {
      setEnv(storedEnv)
    }
  }, [])

  const toggleEnv = (newEnv: Env) => {
    setEnv(newEnv)
    localStorage.setItem("yoobe_console_env", newEnv)
  }

  return {
    env,
    toggleEnv,
    isMounted
  }
}
