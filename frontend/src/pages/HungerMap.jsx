import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { hungerRegions } from '../data/mockRegions'

const NEON = '#00ff88'
const CYAN = '#00e5ff'

function heatColor(intensity) {
  const stops = [NEON, '#eab308', '#f97316', '#dc2626']
  const i = Math.min(stops.length - 1, Math.floor(intensity * stops.length))
  return stops[i]
}

export default function HungerMap() {
  const mapRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [mapReady, setMapReady] = useState(false)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN?.trim?.()
    if (!token || !mapRef.current) {
      setFallback(true)
      return
    }

    mapboxgl.accessToken = token
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [69.3451, 30.3753],
      zoom: 4.6,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.scrollZoom.enable()

    map.on('load', () => {
      const features = hungerRegions.map((r) => ({
        type: 'Feature',
        properties: r,
        geometry: { type: 'Point', coordinates: [r.lng, r.lat] },
      }))

      map.addSource('hunger-points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      })

      map.addLayer({
        id: 'hunger-heat',
        type: 'circle',
        source: 'hunger-points',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'intensity'], 0, 10, 1, 40],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, NEON,
            0.5, '#f97316',
            1, '#dc2626',
          ],
          'circle-opacity': 0.76,
          'circle-blur': 0.55,
          'circle-stroke-color': CYAN,
          'circle-stroke-width': 2,
        },
      })

      map.on('click', 'hunger-heat', (e) => {
        const f = e.features?.[0]
        if (!f?.properties?.id) return
        const r = hungerRegions.find((x) => x.id === f.properties.id) || f.properties
        setSelected({
          ...r,
          lng: typeof r.lng === 'number' ? r.lng : Number.parseFloat(String(r.lng)),
          lat: typeof r.lat === 'number' ? r.lat : Number.parseFloat(String(r.lat)),
          intensity: typeof r.intensity === 'number' ? r.intensity : Number.parseFloat(String(r.intensity)),
        })
      })
      map.on('mouseenter', 'hunger-heat', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'hunger-heat', () => { map.getCanvas().style.cursor = '' })

      setMapReady(true)
    })

    return () => { map.remove() }
  }, [])

  return (
    <div className="relative isolate flex h-[calc(100svh-5rem)] w-full flex-col overflow-hidden px-4 pt-4 sm:px-6 lg:mx-auto lg:max-w-[1680px]">
      
      {/* Header */}
      <div className="glass-strong relative z-20 mb-4 flex shrink-0 flex-col gap-3 rounded-2xl px-5 py-4 shadow-lg shadow-black/40 sm:flex-row sm:items-center sm:justify-between lg:rounded-full lg:px-6 lg:py-3">
        <div>
          <h1 className="font-display text-xl font-bold text-white md:text-2xl">Hunger heat index</h1>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-slate-400 sm:text-[13px]">
            Operational fusion — tap hotspots · mock layer synthesizing shocks, livelihood stress, reach gaps.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 backdrop-blur">
            <span className="h-2 w-14 rounded-full bg-gradient-to-r from-[#00ff88] via-[#f97316] to-[#dc2626]" />
            Stability → Stress
          </span>
          {fallback && (
            <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-100">
              Demo · set VITE_MAPBOX_ACCESS_TOKEN
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="relative min-h-0 flex-1">
        
        {/* Map container */}
        <div
          className="glass-strong absolute inset-0 overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.65)]"
          style={{
            boxShadow: '0 28px 100px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(0,255,136,0.08)',
          }}
        >
          {!fallback && (
            <div ref={mapRef} className="absolute inset-0 h-full w-full" aria-label="Pakistan hunger map" />
          )}
          {fallback && (
            <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-[#030510] via-nm-surface to-black">
              <div className="relative flex flex-1 items-center justify-center p-6">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 35% 30%, rgba(0,255,136,0.12), transparent 45%), radial-gradient(circle at 72% 60%, rgba(0,229,255,0.1), transparent 40%)',
                  }}
                  aria-hidden="true"
                />
                <svg viewBox="50 58 620 620" className="relative z-10 h-[88%] w-[88%] max-h-[620px]" aria-hidden="true">
                  <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M180 460 L290 540 L460 490 L560 370 L490 230 L370 210 L260 290 Z"
                    fill="none"
                    stroke="rgba(148,163,184,0.25)"
                    strokeWidth="2"
                  />
                  {hungerRegions.map((r) => {
                    const cx = ((r.lng - 60) / 85) * 520 + 40
                    const cy = 640 - ((r.lat - 22) / 26) * 520
                    const active = selected?.id === r.id
                    const hover = hoveredId === r.id
                    return (
                      <g key={r.id} className="cursor-pointer" role="presentation">
                        <circle
                          cx={cx}
                          cy={cy}
                          r={(18 + r.intensity * 28) * (hover || active ? 1.06 : 1)}
                          fill={heatColor(r.intensity)}
                          opacity={hover || active ? 0.82 : 0.58}
                          stroke={CYAN}
                          strokeWidth={hover || active ? 2.2 : 1}
                          filter={hover || active ? 'url(#glow)' : undefined}
                          onClick={() => setSelected(r)}
                          onMouseEnter={() => setHoveredId(r.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          className="transition-all duration-300 ease-out"
                        />
                      </g>
                    )
                  })}
                </svg>
                <p className="absolute bottom-4 left-4 right-4 text-center text-[11px] text-slate-500">
                  Fallback canvas projection — Add{' '}
                  <span className="font-mono text-nm-neon">VITE_MAPBOX_ACCESS_TOKEN</span> for{' '}
                  <span className="text-nm-cyan">Mapbox GL</span>.
                </p>
              </div>
            </div>
          )}

          {mapReady && !fallback && (
            <div className="pointer-events-none absolute left-6 top-6 z-30 flex gap-3">
              <span className="rounded-full border border-nm-neon/35 bg-black/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-nm-neon backdrop-blur-md glow-green">
                Mapbox Dark · cockpit
              </span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="pointer-events-none absolute bottom-4 right-4 top-4 z-30 flex w-[21rem] flex-col gap-4 overflow-y-auto lg:pointer-events-auto">
          
          {/* Selected Zone */}
          <div className="glass-strong card-lift rounded-3xl border border-nm-cyan/25 p-5 shadow-xl shadow-black/50">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-nm-cyan">Selected zone</p>
              {selected?.intensity != null && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
                  style={{
                    background: selected.intensity > 0.8 ? 'rgba(220,38,38,0.2)' : selected.intensity > 0.5 ? 'rgba(251,146,60,0.2)' : 'rgba(0,255,136,0.16)',
                    color: selected.intensity > 0.8 ? '#fecaca' : selected.intensity > 0.5 ? '#fdba74' : '#86efac',
                  }}
                >
                  {(selected.intensity * 100).toFixed(0)}% stress
                </span>
              )}
            </div>
            {selected ? (
              <>
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-white">{selected.name}</h3>
                <dl className="mt-4 space-y-3 text-[13px] text-slate-300">
                  <div className="flex justify-between gap-3 rounded-xl bg-black/35 px-3 py-2">
                    <dt className="text-slate-500">Population at risk</dt>
                    <dd className="font-mono text-sm text-white">
                      {selected.population_at_risk?.toLocaleString?.() ?? '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Context</dt>
                    <dd className="mt-2 leading-relaxed text-slate-300">{selected.notes}</dd>
                  </div>
                  <div className="flex justify-between gap-2 rounded-xl bg-black/25 px-3 py-2 font-mono text-[11px] text-slate-400">
                    <span>LAT / LNG</span>
                    <span>{selected.lat?.toFixed(2)}, {selected.lng?.toFixed(2)}</span>
                  </div>
                </dl>
              </>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Deploy a beacon — click any halo on the terrain to stream administrative context.
              </p>
            )}
          </div>

          {/* Priority Runway */}
          <div className="glass-strong card-lift rounded-3xl border border-white/[0.08] p-5 shadow-xl shadow-black/50">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Priority runway</p>
            <ul className="mt-4 space-y-2">
              {[...hungerRegions]
                .sort((a, b) => b.intensity - a.intensity)
                .slice(0, 5)
                .map((r, i) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(r)}
                      className={[
                        'group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all duration-200',
                        selected?.id === r.id
                          ? 'border-nm-neon/45 bg-black/55 glow-green'
                          : 'border-transparent hover:border-nm-neon/25 hover:bg-nm-neon/[0.07]',
                      ].join(' ')}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/55 font-display text-sm font-bold text-nm-neon ring-2 ring-transparent transition group-hover:ring-nm-cyan/30">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-medium text-white">{r.name}</span>
                      <span className="shrink-0 text-xs font-bold text-nm-cyan">{(r.intensity * 100).toFixed(0)}%</span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
