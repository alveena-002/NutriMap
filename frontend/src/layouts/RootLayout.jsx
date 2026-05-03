import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export function RootLayout() {
  const { pathname } = useLocation()
  const isFullBleedMap = pathname === '/hunger-map'

  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="nm-grid-bg" aria-hidden="true" />
      <div className="nm-vignette" aria-hidden="true" />
      <Navbar />
      <main
        className={
          isFullBleedMap
            ? 'relative z-10 w-full flex-1 px-0 pb-0 pt-0 md:pt-2'
            : 'relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6 md:py-8'
        }
      >
        <div key={pathname} className="page-enter h-full">
          <Outlet />
        </div>
      </main>
      <footer className="relative z-10 border-t border-white/[0.07] bg-black/20 py-4 text-center text-[11px] text-slate-500 backdrop-blur-sm md:text-xs">
        NutriMap · SDG 2 Zero Hunger · Simulated analytics for demonstration
      </footer>
    </div>
  )
}
