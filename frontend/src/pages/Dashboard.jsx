import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'
import { AIActiveIndicator } from '../components/AIActiveIndicator'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { baseStats, chartMealsTrend, chartSeriesRegional } from '../data/mockStats'

const NEON = '#00ff88'
const CYAN = '#00e5ff'

function formatMillions(n) {
  return `${(n / 1e6).toFixed(2)}M`
}

export default function Dashboard() {
  const [ready, setReady] = useState(false)
  const [liveBump, setLiveBump] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 480)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setLiveBump((x) => x + 1), 5000)
    return () => clearInterval(id)
  }, [])

  const kpis = useMemo(() => {
    const wobble = Math.sin(liveBump * 0.7) * 4200
    return {
      insecure: Math.round(baseStats.foodInsecurePopulation + wobble),
      zones: baseStats.hungerZones + ((liveBump % 3) - 1),
      meals: baseStats.mealsDistributed + liveBump * 184,
      accuracy: Math.min(
        99.1,
        baseStats.aiAccuracyPct + Number((Math.sin(liveBump * 0.4) * 0.08).toFixed(2)),
      ),
    }
  }, [liveBump])

  const a1 = useAnimatedNumber(kpis.insecure, 950)
  const a2 = useAnimatedNumber(kpis.zones, 700)
  const a3 = useAnimatedNumber(kpis.meals, 900)
  const a4 = useAnimatedNumber(Math.round(kpis.accuracy * 10) / 10, 800)

  if (!ready) return <DashboardSkeleton />

  const tooltipStyle = {
    background: 'linear-gradient(160deg, rgba(6,14,22,0.96), rgba(4,10,16,0.94))',
    border: `1px solid rgba(0,255,136,0.28)`,
    borderRadius: 14,
    boxShadow: '0 18px 50px rgba(0,0,0,0.55), 0 0 30px rgba(0,229,255,0.06)',
    color: '#e2e8f0',
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="glass-strong relative overflow-hidden rounded-3xl px-6 py-6 md:px-8 md:py-7">
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-70 blur-3xl"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,255,136,0.22), transparent 65%)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-10 left-10 h-40 w-40 rounded-full opacity-50 blur-3xl"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,229,255,0.18), transparent 65%)',
            }}
            aria-hidden="true"
          />
          <p className="relative text-[10px] font-bold uppercase tracking-[0.35em] text-nm-cyan/90 md:text-[11px]">
            Mission telemetry
          </p>
          <h1 className="relative mt-2 font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.65rem]">
            Pakistan{' '}
            <span className="bg-gradient-to-r from-nm-neon via-white to-nm-cyan bg-clip-text text-transparent">
              food security
            </span>{' '}
            cockpit
          </h1>
          <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-[15px]">
            Real-time ingestion, fused GIS layers, and model-assisted corridors — calibrated to SDG 2, 3 & 10.
          </p>
        </div>
        <AIActiveIndicator label="AI ACTIVE · models online" className="shrink-0 self-start lg:self-end" />
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { n: '2', t: 'Zero Hunger', sub: 'Aggregate adequacy lens' },
          { n: '3', t: 'Good Health', sub: 'Micronutrient guardrails' },
          { n: '10', t: 'Reduced Inequalities', sub: 'Equity-weighted routing' },
        ].map((s, i) => (
          <div
            key={s.n}
            className="group/sdg flex items-center gap-3 rounded-full border border-white/[0.08] bg-black/45 px-3 py-2 pr-5 shadow-inner shadow-black/30 transition duration-300 hover:border-nm-neon/40 hover:shadow-[0_0_24px_rgba(0,255,136,0.12)]"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nm-neon/25 to-nm-cyan/20 font-display text-lg font-bold text-nm-neon glow-green ring-2 ring-black/70">
              {s.n}
            </span>
            <div className="min-w-0 text-left leading-tight">
              <p className="font-display text-sm font-semibold text-white">{s.t}</p>
              <p className="truncate text-[10px] uppercase tracking-wider text-slate-500 group-hover/sdg:text-slate-400">
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            k: 'insecure',
            title: 'Food insecure population',
            subtitle: 'Survey + sentinel markets',
            accent: NEON,
            value: formatMillions(a1),
            glowClass: 'from-nm-neon/35',
          },
          {
            k: 'zones',
            title: 'Hunger corridors',
            subtitle: 'Units above acute cut',
            accent: CYAN,
            value: String(Math.round(a2)),
            glowClass: 'from-nm-cyan/35',
          },
          {
            k: 'meals',
            title: 'Meals secured · program',
            subtitle: 'School + NGO kitchen mesh',
            accent: NEON,
            value: Math.round(a3).toLocaleString(),
            glowClass: 'from-nm-neon/30',
          },
          {
            k: 'accuracy',
            title: 'AI triage accuracy',
            subtitle: 'Zero-shot + QA convergence',
            accent: CYAN,
            value: `${a4.toFixed(1)}%`,
            glowClass: 'from-nm-cyan/30',
          },
        ].map((c) => (
          <div
            key={c.k}
            className="glass-strong card-lift group relative overflow-hidden rounded-3xl border border-white/[0.06] p-6"
          >
            <div
              className={`pointer-events-none absolute inset-px rounded-[22px] bg-gradient-to-br ${c.glowClass} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              aria-hidden="true"
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: `${c.accent}bb` }}>
              {c.title}
            </p>
            <p
              className="relative mt-4 font-display text-3xl font-bold tracking-tight text-white lg:text-[2rem]"
              style={{
                textShadow: `0 0 36px rgba(0,255,136,0.18)`,
              }}
            >
              {c.value}
            </p>
            <p className="relative mt-2 text-[11px] text-slate-500">{c.subtitle}</p>
            <div
              className="relative mt-5 h-0.5 w-full overflow-hidden rounded-full bg-black/50"
              aria-hidden="true"
            >
              <div
                className="h-full w-[55%] rounded-full bg-gradient-to-r from-nm-neon via-nm-cyan to-transparent opacity-80 transition-all duration-500 group-hover:w-[85%]"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass-strong rounded-3xl border border-white/[0.06] p-5 md:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-white md:text-xl">Acute vs moderate prevalence</h2>
              <p className="mt-1 text-[12px] text-slate-500">Synthetic corridor blend · pilot sentinel districts</p>
            </div>
            <span className="rounded-full border border-nm-neon/35 bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-nm-neon">
              ICDS aware
            </span>
          </div>
          <div className="h-72 w-full md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartSeriesRegional} margin={{ left: -8, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={NEON} stopOpacity={0.55} />
                    <stop offset="100%" stopColor={NEON} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CYAN} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.06)" strokeDasharray="3 12" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="rgba(100,116,139,0.5)"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(100,116,139,0.5)"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'DM Sans' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: NEON, strokeWidth: 1, strokeDasharray: '4 8' }} />
                <Area type="monotone" dataKey="acute" stackId="1" stroke={NEON} strokeWidth={2} fill="url(#gA)" />
                <Area
                  type="monotone"
                  dataKey="moderate"
                  stackId="1"
                  stroke={CYAN}
                  strokeWidth={2}
                  fill="url(#gB)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-strong rounded-3xl border border-white/[0.06] p-5 md:p-7">
          <div className="mb-6">
            <h2 className="font-display text-lg font-semibold text-white md:text-xl">Meal throughput · corridors</h2>
            <p className="mt-1 text-[12px] text-slate-500">Synthetic dispatch pulses · consolidated kitchens</p>
          </div>
          <div className="h-72 w-full md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartMealsTrend} margin={{ left: -8, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={NEON} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CYAN} stopOpacity={0.92} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.06)" strokeDasharray="3 12" vertical={false} />
                <XAxis
                  dataKey="week"
                  stroke="rgba(100,116,139,0.5)"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(100,116,139,0.5)"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: 'rgba(0,255,136,0.06)' }} contentStyle={tooltipStyle} />
                <Bar dataKey="meals" fill="url(#barGrad)" radius={[10, 10, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
