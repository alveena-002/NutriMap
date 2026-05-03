import { NavLink } from 'react-router-dom'

function IconDash({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h7v7H4V4zm9 0h7v4h-7V4zM4 13h7v7H4v-7zm11 9h7v-4h-7v4zm7-13h-4v7h7V9h-3V4z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  )
}

function IconMap({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-5.06 7-11a7 7 0 10-14 0c0 5.94 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
    </svg>
  )
}

function IconFork({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 3v18M16 10a3 3 0 100-6 3 3 0 000 6zM8 3a3 3 0 100 6 3 3 0 003-3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function IconSpark({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.84 6.36L21 11l-7.16 2.64L12 21l-1.84-6.36L3 13l7.16-2.64L12 2z"
        stroke="currentColor"
        strokeWidth="1.15"
      />
    </svg>
  )
}

const links = [
  { to: '/', end: true, label: 'Dashboard', Icon: IconDash },
  { to: '/hunger-map', label: 'Hunger Map', Icon: IconMap },
  { to: '/meal-finder', label: 'Meal Finder', Icon: IconFork },
  { to: '/ai-assistant', label: 'AI Assistant', Icon: IconSpark },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-2xl">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nm-neon/50 to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 md:gap-8 md:px-6 md:py-4">
        <NavLink to="/" className="group flex items-center gap-3 outline-none ring-nm-neon/50 focus-visible:ring-2">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-nm-neon/35 bg-black/60 transition-all duration-300 group-hover:border-nm-cyan/50 group-hover:glow-green">
            <span
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  'radial-gradient(circle at 30% 20%, rgba(0,255,136,0.25), transparent 55%), radial-gradient(circle at 70% 80%, rgba(0,229,255,0.2), transparent 50%)',
              }}
              aria-hidden="true"
            />
            <span className="font-display relative text-lg font-bold tracking-tight text-nm-neon transition group-hover:text-glow">
              N
            </span>
          </span>
          <div className="text-left leading-tight">
            <p className="font-display text-[15px] font-semibold tracking-tight text-white md:text-base">NutriMap</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-nm-neon/90">Pakistan Ops</p>
          </div>
        </NavLink>

        <nav
          className="order-3 flex flex-[1_1_100%] flex-wrap justify-center gap-1 rounded-2xl border border-white/[0.07] bg-black/35 p-1.5 shadow-inner shadow-black/40 sm:flex-[1_auto] md:order-none md:flex-[unset] lg:justify-center lg:rounded-full lg:px-2"
          aria-label="Main"
        >
          {links.map(({ to, end, label, Icon }) => (
            <NavLink key={to} to={to} {...(end ? { end: true } : {})} className="group/nav relative shrink-0">
              {({ isActive }) => (
                <span
                  className={[
                    'relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-300 lg:rounded-full lg:px-4',
                    isActive
                      ? 'text-[#061208] glow-green shadow-[inset_0_0_0_1px_rgba(0,229,255,0.35)]'
                      : 'text-slate-400 hover:text-nm-neon hover:shadow-[0_0_20px_rgba(0,255,136,0.12)]',
                  ].join(' ')}
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #00ff88 0%, #00e5ff 100%)'
                      : 'transparent',
                  }}
                >
                  <Icon className={[isActive ? 'text-black/85' : 'text-nm-neon/60 transition group-hover/nav:text-nm-neon'].join(' ')} />
                  <span>{label}</span>
                  {isActive && (
                    <span
                      className="absolute inset-0 -z-10 rounded-xl opacity-55 blur-xl lg:rounded-full"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.45), transparent 70%)' }}
                      aria-hidden="true"
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 rounded-full border border-nm-cyan/35 bg-black/55 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-nm-cyan shadow-[0_0_22px_rgba(0,229,255,0.15)] md:flex md:text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nm-neon opacity-55" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-nm-neon shadow-[0_0_12px_#00ff88]" />
          </span>
          Live ingest
        </div>
      </div>
    </header>
  )
}
