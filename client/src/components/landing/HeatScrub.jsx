import { useRef } from 'react';
import { gsap, useGSAP, cssVar } from '../../lib/gsapSetup';

/**
 * One node scrubbed through Cold -> Heating -> Forged while the section is pinned.
 * Desktop + motion allowed: pinned scrub. Otherwise: renders the final Forged state.
 */
export default function HeatScrub() {
  const root = useRef(null);
  const pct = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const heat = cssVar('--forge-heat') || '#e0a03a';
      const accent = cssVar('--forge-accent') || '#0a66c2';
      const onAccent = cssVar('--forge-on-accent') || '#ffffff';
      const q = (s) => el.querySelector(s);

      const build = (scrollDriven) => {
        const proxy = { p: 0 };
        let last = '';
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: scrollDriven
            ? { trigger: el, start: 'top top', end: '+=1800', scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true }
            : undefined,
        });

        // readout + state label (writes to the DOM directly, no React re-render per frame)
        tl.to(proxy, {
          p: 1, duration: 3,
          onUpdate: () => {
            const p = proxy.p;
            if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(3, '0') + '%';
            const s = p < 0.34 ? 'cold' : p < 0.67 ? 'heating' : 'forged';
            if (s !== last) { el.dataset.state = s; last = s; }
          },
        }, 0);

        const bar = q('.hs-bar');
        const check = q('.hs-check');
        if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' });
        if (check) gsap.set(check, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });

        tl.to(q('.hs-box'), { stroke: heat, duration: 0.5 }, 1)
          .to(q('.hs-bar'), { scaleX: 0.65, duration: 1, backgroundColor: heat }, 1)
          .to(q('.hs-bar'), { scaleX: 1, duration: 0.6, backgroundColor: accent }, 2)
          .to(q('.hs-box'), { fill: accent, stroke: accent, duration: 0.4 }, 2.3)
          .to(q('.hs-text'), { fill: onAccent, duration: 0.4 }, 2.3)
          .to(q('.hs-check'), { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 2.5)
          .fromTo(q('.hs-spark'), { attr: { r: 10 }, opacity: 0.9 }, { attr: { r: 46 }, opacity: 0, duration: 0.5, ease: 'power2.out' }, 2.5);

        return tl;
      };

      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => { build(true); });
      mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => { build(false).progress(1); });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} data-state="cold" aria-labelledby="heat-title"
      className="group relative flex min-h-screen items-center bg-[var(--forge-canvas)] px-6 py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <h2 id="heat-title" className="text-3xl font-semibold tracking-tight text-[var(--forge-ink)] md:text-5xl">
            Progress you can see.
          </h2>
          <p className="mt-4 max-w-md text-[var(--forge-muted)]">
            Every topic starts cold. Start it and it heats. Finish it and it is forged into the map.
          </p>
          <ul className="mt-8 space-y-3 font-mono text-sm text-[var(--forge-muted)]">
            <li className="transition-colors group-data-[state=cold]:text-[var(--forge-ink)]">cold: not started</li>
            <li className="transition-colors group-data-[state=heating]:text-[var(--forge-heat)]">heating: in progress</li>
            <li className="transition-colors group-data-[state=forged]:text-[var(--forge-accent)]">forged: done</li>
          </ul>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-[var(--forge-card)] p-8 dark:border-white/[0.08]">
          <svg viewBox="0 0 360 110" className="block h-auto w-full" role="img" aria-label="A topic node moving from cold to forged">
            <rect className="hs-box f-box" x="30" y="30" width="300" height="50" rx="8" />
            <text className="hs-text f-label" x="165" y="55" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 14 }}>
              HTTP and REST basics
            </text>
            <g transform="translate(305 55)">
              <path className="hs-check f-check" d="M-7 0 L-2 5 L8 -6" />
              <circle className="hs-spark f-spark" r="10" />
            </g>
          </svg>
          <div className="mt-6 flex items-center gap-4">
            <div className="h-1.5 flex-1 overflow-hidden rounded-md bg-[var(--forge-raised)]">
              <div className="hs-bar h-full w-full bg-[var(--forge-heat)]" />
            </div>
            <span ref={pct} className="font-mono text-sm tabular-nums text-[var(--forge-ink)]">000%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
