import { useEffect, useRef, useState } from 'react'

/** Interpolates toward `target` when it changes (from last rendered value). */
export function useAnimatedNumber(target, duration = 900) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)

  useEffect(() => {
    const start = fromRef.current
    const end = typeof target === 'number' ? target : 0
    const t0 = performance.now()

    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - (1 - p) ** 3
      const next = start + (end - start) * eased
      setValue(next)
      if (p < 1) requestAnimationFrame(tick)
      else fromRef.current = end
    }

    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [target, duration])

  return value
}
