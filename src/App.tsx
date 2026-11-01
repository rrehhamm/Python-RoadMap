import { useEffect, useRef, useState } from 'react'
import { SplitHeading } from './components/fx/SplitHeading'
import { Overview } from './components/Overview'
import { gsap, prefersReducedMotion, useGSAP } from './motion/gsap'
import { useSmoothScroll } from './motion/useSmoothScroll'
import { Roadmap } from './components/Roadmap'
import { Toolbar } from './components/Toolbar'
import { TopicDrawer } from './components/TopicDrawer'
import { RoadmapProvider } from './state/RoadmapContext'
import { useRoadmap } from './state/roadmap'

type Theme = 'light' | 'dark' | null

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const t = localStorage.getItem('cp-roadmap:theme')
      return t === 'light' || t === 'dark' ? t : null
    } catch {
      return null
    }
  })
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme
    else delete document.documentElement.dataset.theme
    try {
      if (theme) localStorage.setItem('cp-roadmap:theme', theme)
      else localStorage.removeItem('cp-roadmap:theme')
    } catch {
      /* ignore */
    }
  }, [theme])
  const systemDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const effective = theme ?? (systemDark ? 'dark' : 'light')
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={`Switch to ${effective === 'dark' ? 'light' : 'dark'} theme`}
      onClick={() => setTheme(effective === 'dark' ? 'light' : 'dark')}
    >
      {effective === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function Page() {
  const { selectedId } = useRoadmap()
  const introRef = useRef<HTMLElement>(null)
  useSmoothScroll()

  // One-time entrance: copy, overview and toolbar settle in under the heading.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.intro .lede, .overview, .toolbar', {
        y: 14,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.25,
        clearProps: 'transform,opacity',
      })
    },
    { scope: introRef },
  )

  return (
    <div className={`app${selectedId ? ' app--drawer' : ''}`}>
      <a className="skip" href="#roadmap">
        Skip to roadmap
      </a>
      <header className="masthead">
        <div className="brand">
          <span className="brand-mark mono" aria-hidden="true">
            &gt;_
          </span>
          <span className="brand-name">cp.path</span>
        </div>
        <ThemeToggle />
      </header>
      <main ref={introRef}>
        <div className="intro">
          <SplitHeading>Python → Competitive Programming</SplitHeading>
          <p className="lede">
            A personal roadmap from your first <code>input()</code> to Codeforces 1200 and core algorithms. Stages unlock as you finish their
            prerequisites; the Codeforces track runs alongside from day one.
          </p>
        </div>
        <Overview />
        <Toolbar />
        <div id="roadmap" tabIndex={-1}>
          <Roadmap />
        </div>
      </main>
      <footer className="foot small muted">
        Progress is saved in this browser. Ratings are approximate difficulty milestones, not guarantees of skill.
      </footer>
      <TopicDrawer />
    </div>
  )
}

export default function App() {
  return (
    <RoadmapProvider>
      <Page />
    </RoadmapProvider>
  )
}
