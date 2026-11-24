import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsapSetup';

const STEPS = [
  { title: 'Answer a short skill check', body: 'Six questions: your tracks, experience, five technical checks, weekly hours and target date.' },
  { title: 'Skip what you already know', body: 'Phases you pass are marked mastered. Partly familiar ones become a faster review. The rest is scheduled on a real calendar.' },
  { title: 'Forge the map', body: 'Mark topics done and watch the map heat up, with a projected finish date that updates as you go.' },
];

// Replace these mocks with the app's real components/data when available.
const Quiz = () => (
  <div className="space-y-3">
    <p className="font-mono text-xs text-[var(--forge-muted)]">question 3 of 5</p>
    <p className="text-lg text-[var(--forge-ink)]">What does an HTTP 304 response mean?</p>
    {['Not modified', 'Unauthorized', 'Server error', 'Moved permanently'].map((o, i) => (
      <div key={o} className={`rounded-lg border px-4 py-2.5 text-sm ${i === 0 ? 'border-[#0A66C2] text-[var(--forge-ink)]' : 'border-black/[0.08] text-[var(--forge-muted)] dark:border-white/[0.08]'}`}>{o}</div>
    ))}
  </div>
);
const Phases = () => (
  <ul className="space-y-3">
    {[['Internet fundamentals', 'mastered'], ['JavaScript core', 'review'], ['Node and Express', 'new'], ['Databases', 'new']].map(([n, s]) => (
      <li key={n} className="flex items-center justify-between rounded-lg border border-black/[0.08] px-4 py-3 dark:border-white/[0.08]">
        <span className="text-sm text-[var(--forge-ink)]">{n}</span>
        <span className={`rounded-md px-2 py-0.5 font-mono text-xs ${s === 'mastered' ? 'bg-[#0A66C2] text-white' : s === 'review' ? 'border border-[var(--forge-heat)] text-[var(--forge-heat)]' : 'border border-black/[0.08] text-[var(--forge-muted)] dark:border-white/[0.08]'}`}>{s}</span>
      </li>
    ))}
  </ul>
);
const Forge = () => (
  <div className="space-y-3 font-mono text-sm">
    {[['HTML and CSS', 'forged'], ['Git basics', 'forged'], ['REST APIs', 'heating'], ['Auth', 'cold']].map(([n, s]) => (
      <div key={n} className={`rounded-lg border px-4 py-2.5 ${s === 'forged' ? 'border-[#0A66C2] bg-[#0A66C2] text-white' : s === 'heating' ? 'border-[var(--forge-heat)] text-[var(--forge-ink)]' : 'border-black/[0.08] text-[var(--forge-muted)] dark:border-white/[0.08]'}`}>{n}</div>
    ))}
    <p className="pt-2 text-[var(--forge-muted)]">projected finish: 14 Mar 2027</p>
  </div>
);
const PANELS = [Quiz, Phases, Forge];

export default function HowItWorksPinned() {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const steps = gsap.utils.toArray('.hw-step', el);
      const panels = gsap.utils.toArray('.hw-panel', el);

      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 24 });
        gsap.set(steps.slice(1), { opacity: 0.35 });

        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${STEPS.length * 700}`, scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo('.hw-progress', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: STEPS.length - 1 }, 0);
        for (let i = 1; i < STEPS.length; i++) {
          tl.to(panels[i - 1], { autoAlpha: 0, y: -24, duration: 0.5 }, i - 0.5)
            .to(panels[i], { autoAlpha: 1, y: 0, duration: 0.5 }, i - 0.25)
            .to(steps[i - 1], { opacity: 0.35, duration: 0.4 }, i - 0.5)
            .to(steps[i], { opacity: 1, duration: 0.4 }, i - 0.25);
        }
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="how-it-works" aria-labelledby="how-title" className="relative bg-[var(--forge-canvas)] px-6 py-24 md:flex md:min-h-screen md:items-center">
      <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-2">
        <div>
          <h2 id="how-title" className="text-3xl font-semibold tracking-tight text-[var(--forge-ink)] md:text-5xl">From skill check to finish date.</h2>
          <div className="relative mt-10 pl-6">
            <div className="absolute bottom-0 left-0 top-0 w-px bg-black/[0.08] dark:border-white/[0.08]" />
            <div className="hw-progress absolute left-0 top-0 h-full w-px origin-top bg-[#0A66C2]" />
            <ol className="space-y-8">
              {STEPS.map((s, i) => (
                <li key={s.title} className="hw-step">
                  <p className="font-mono text-xs text-[var(--forge-muted)]">step {i + 1}</p>
                  <h3 className="text-lg font-medium text-[var(--forge-ink)]">{s.title}</h3>
                  <p className="mt-1 max-w-md text-sm text-[var(--forge-muted)]">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="relative space-y-6 md:h-[420px] md:space-y-0">
          {PANELS.map((P, i) => (
            <div key={i} className="hw-panel rounded-xl border border-black/[0.08] bg-[var(--forge-card)] p-6 dark:border-white/[0.08] md:absolute md:inset-0">
              <P />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
