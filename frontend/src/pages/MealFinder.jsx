import { useMemo, useState } from 'react'
import { meals, mealTags } from '../data/mockMeals'

const nutritionOptions = [{ value: 'any', label: 'Any macro' }, ...mealTags.filter((t) => t !== 'budget').map((t) => ({
  value: t,
  label: t.charAt(0).toUpperCase() + t.slice(1),
}))]

export default function MealFinder() {
  const [nutrition, setNutrition] = useState('balanced')
  const [budget200, setBudget200] = useState(true)

  const filtered = useMemo(() => {
    return meals.filter((m) => {
      if (nutrition !== 'any' && !m.nutrition.includes(nutrition)) return false
      if (budget200 && m.pricePk > 200) return false
      return true
    })
  }, [nutrition, budget200])

  return (
    <div className="space-y-10">
      <header className="glass-strong relative overflow-hidden rounded-3xl border border-white/[0.06] px-6 py-7 md:px-8 md:py-9">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'linear-gradient(120deg, rgba(0,255,136,0.06), transparent 40%, transparent 58%, rgba(0,229,255,0.05))',
          }}
          aria-hidden="true"
        />
        <h1 className="relative font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
          Meal finder
        </h1>
        <p className="relative mt-3 max-w-3xl text-sm leading-relaxed text-slate-400 md:text-[15px]">
          AI-aligned trays for subsidy-grade nutrition — illustrative catalog calibrated to Karachi · Lahore · interior
          townships (street kitchens, school programs).
        </p>
      </header>

      <section className="glass-strong rounded-3xl border border-white/[0.06] px-5 py-6 md:px-7 md:py-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-nm-neon">Nutrition focus</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {nutritionOptions.map((opt) => {
                const active = nutrition === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNutrition(opt.value)}
                    className={[
                      'rounded-full border px-4 py-2 text-[13px] font-medium outline-none ring-nm-neon/30 transition-all duration-200 focus-visible:ring-2 active:scale-[0.97]',
                      active
                        ? 'border-transparent bg-gradient-to-r from-nm-neon to-nm-cyan text-black shadow-[0_0_28px_rgba(0,255,136,0.35)]'
                        : 'border-white/[0.1] bg-black/40 text-slate-300 hover:border-nm-neon/35 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:w-56 lg:border-l lg:border-white/[0.06] lg:pl-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-nm-cyan">Budget corridor</p>
            <button
              type="button"
              role="switch"
              aria-checked={budget200}
              onClick={() => setBudget200((x) => !x)}
              className={[
                'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left outline-none ring-nm-neon/30 transition-all duration-200 focus-visible:ring-2',
                budget200
                  ? 'border-nm-neon/40 bg-nm-neon/[0.1] glow-green'
                  : 'border-white/[0.1] bg-black/35 hover:border-nm-cyan/30',
              ].join(' ')}
            >
              <span className="text-[13px] font-medium text-white">≤ 200 PKR</span>
              <span
                className={[
                  'relative h-7 w-[52px] shrink-0 rounded-full transition-colors duration-300',
                  budget200 ? 'bg-gradient-to-r from-nm-neon to-nm-cyan' : 'bg-slate-700',
                ].join(' ')}
                aria-hidden="true"
              >
                <span
                  className={[
                    'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-[left] duration-300',
                    budget200 ? 'left-[26px]' : 'left-[3px]',
                  ].join(' ')}
                />
              </span>
            </button>
            <p className="text-[11px] leading-snug text-slate-500">
              Flip off to expose higher-cost balanced plates (&lt; demos only).
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-6">
          <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Active filters
          </span>
          <span className="text-sm text-white">
            {nutritionOptions.find((o) => o.value === nutrition)?.label}
            {' · '}
            {budget200 ? 'Economy corridor' : 'All tiers'}
          </span>
          <span className="ml-auto rounded-full border border-nm-cyan/30 bg-nm-cyan/10 px-3 py-1 text-xs font-bold text-nm-cyan tabular-nums">
            {filtered.length} trays
          </span>
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((m) => (
          <article
            key={m.id}
            className="glass-strong card-lift group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] p-6"
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at 50% -20%, rgba(0,255,136,0.15), transparent 55%), radial-gradient(circle at 50% 120%, rgba(0,229,255,0.1), transparent 45%)',
              }}
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-glow md:text-xl">
                {m.name}
              </h3>
              <span className="shrink-0 rounded-full bg-gradient-to-r from-nm-neon to-nm-cyan px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
                {m.pricePk}{' '}
                <abbr title="Pakistani Rupee" className="no-underline">
                  PKR
                </abbr>
              </span>
            </div>
            <p className="relative mt-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              ~{m.calories} kcal ·{' '}
              <span className="text-nm-cyan/90">{m.nutrition.join(' · ')}</span>
            </p>
            <div className="relative mt-5 flex flex-1 flex-col border-t border-white/[0.06] pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-nm-neon">Ingredients</p>
              <ul className="mt-3 space-y-2 text-[13px] leading-snug text-slate-300">
                {m.ingredients.map((ing) => (
                  <li
                    key={ing}
                    className="relative flex gap-2 before:pointer-events-none before:mt-[0.42em] before:h-2 before:w-2 before:shrink-0 before:rounded-sm before:bg-gradient-to-br before:from-nm-neon before:to-nm-cyan before:opacity-80"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <p className="text-center text-sm text-slate-500">Nothing matches · broaden macro focus or allowance.</p>
      )}
    </div>
  )
}
