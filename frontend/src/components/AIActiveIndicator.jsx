import { useEffect, useState } from 'react'

export function AIActiveIndicator({ label = 'AI ACTIVE', className = '' }) {
  const [pulse, setPulse] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1600)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-nm-neon/40 bg-black/55 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-nm-neon backdrop-blur-md ${className}`}
      role="status"
      aria-live="polite"
      style={{
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.06),
          0 0 32px rgba(0, 255, 136, ${pulse ? '0.4' : '0.2'}),
          0 0 60px rgba(0, 229, 255, ${pulse ? '0.12' : '0.06'})`,
      }}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-50"
          style={{ backgroundColor: pulse ? '#00ff88' : '#00e5ff' }}
        />
        <span
          className="relative rounded-full"
          style={{
            width: 10,
            height: 10,
            background: pulse ? 'linear-gradient(135deg,#00ff88,#00e5ff)' : '#00e5ff',
            boxShadow: pulse ? '0 0 14px #00ff88' : '0 0 14px #00e5ff',
          }}
        />
      </span>
      <span className="relative text-glow">{label}</span>
    </div>
  )
}
