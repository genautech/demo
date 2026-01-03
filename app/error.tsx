"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-black">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado!</h2>
      <div className="bg-gray-100 p-4 rounded mb-4 max-w-2xl overflow-auto">
        <p className="font-mono text-sm">{error.message}</p>
        {error.stack && (
          <pre className="mt-2 text-xs text-gray-500">{error.stack}</pre>
        )}
      </div>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tentar novamente
      </button>
    </div>
  )
}
