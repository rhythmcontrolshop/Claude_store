'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full max-w-sm text-center">
        <h1 className="text-sm font-bold mb-4" style={{ color: '#000000' }}>ERROR DE RENDERIZADO</h1>
        {error.digest && (
          <p className="text-xs mb-4 font-mono p-3" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
            digest: {error.digest}
          </p>
        )}
        <p className="text-xs mb-6" style={{ color: '#6b7280' }}>{error.message}</p>
        <button
          onClick={reset}
          className="text-xs px-6 py-2"
          style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
        >
          REINTENTAR
        </button>
      </div>
    </main>
  )
}
