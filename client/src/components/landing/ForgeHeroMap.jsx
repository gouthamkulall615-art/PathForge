import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, cssVar } from '../../lib/gsapSetup';
import { layoutForge, NODE_W, NODE_H } from '../../lib/forgeLayout';

function useVertical() {
  const [v, setV] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setV(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return v;
}

const clip = (s, n = 17) => (s.length > n ? s.slice(0, n - 1) + '\u2026' : s);

/**
 * Cold -> Heating -> Forged sequence along the trunk.
 * Props: phases (from toForgePhases), themeKey (pass the theme string so colors re-resolve on toggle).
 */
export default function ForgeHeroMap({ phases = [], themeKey = 'dark' }) {
  const root = useRef(null);
  const tlRef = useRef(null);
  const vertical = useVertical();
  const L = useMemo(() => layoutForge(phases, { vertical }), [phases, vertical]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = (s) => gsap.utils.toArray(s, el);

      const heat = cssVar('--forge-heat') || '#e0a03a';
      const accent = cssVar('--forge-accent') || '#0a66c2';
      const onAccent = cssVar('--forge-on-accent') || '#ffffff';

      const mm = gsap.matchMedia();
      mm.add({ reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
        const { reduce } = ctx.conditions;
        const trunk = q('.f-trunk')[0];
        const ember = q('.f-ember')[0];

        if (!trunk) return;

        // 1. initial (cold) state: lines undrawn, nodes hidden
        [trunk, ...q('.f-link')].forEach((p) => {
          if (!p) return;
          const len = p.getTotalLength?.() || 200;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(q('.f-hub-in, .f-node-in'), { opacity: 0, scale: 0.6 });
        gsap.set(q('.f-check'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });

        // 2. master timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(trunk, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0);

        phases.forEach((_, i) => {
          const t = 0.5 + i * 1.5; // each phase starts 1.5s after the previous
          const hub = q(`.f-hub-in[data-phase="${i}"]`);
          const links = q(`.f-link[data-phase="${i}"]`);
          const nodes = q(`.f-node-in[data-phase="${i}"]`);
          const boxes = nodes.map((n) => n.querySelector('.f-box')).filter(Boolean);
          const labels = nodes.map((n) => n.querySelector('.f-label')).filter(Boolean);
          const checks = nodes.map((n) => n.querySelector('.f-check')).filter(Boolean);
          const sparks = nodes.map((n) => n.querySelector('.f-spark')).filter(Boolean);
          const hubDot = q(`.f-hub-in[data-phase="${i}"] .f-hub`);

          tl.to(hub, { opacity: 1, scale: 1, duration: 0.45 }, t)
            .to(links, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 }, t + 0.15)
            .to(nodes, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08 }, t + 0.4)
            // heating
            .to(boxes, { stroke: heat, duration: 0.35, stagger: 0.08 }, t + 0.9)
            // forged
            .to(boxes, { fill: accent, stroke: accent, duration: 0.3, stagger: 0.08 }, t + 1.2)
            .to(labels, { fill: onAccent, duration: 0.3, stagger: 0.08 }, t + 1.2)
            .to(checks, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2.2)', stagger: 0.08 }, t + 1.3)
            .fromTo(
              sparks,
              { attr: { r: 6 }, opacity: 0.9 },
              { attr: { r: 24 }, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 },
              t + 1.3
            )
            .to(hubDot, { fill: accent, stroke: accent, duration: 0.3 }, t + 1.5);
        });

        // 3. personalised-path ember: flowing dashes on the trunk once everything is forged
        if (reduce) {
          tl.progress(1).pause();
          if (ember) gsap.set(ember, { opacity: 1 });
        } else {
          if (ember) {
            tl.to(ember, { opacity: 1, duration: 0.6 }, '>-0.2');
            gsap.to(ember, { strokeDashoffset: -160, duration: 4, ease: 'none', repeat: -1 });
          }
        }

        tlRef.current = tl;
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [L, themeKey], revertOnUpdate: true }
  );

  return (
    <figure ref={root} className="relative m-0">
      <svg
        viewBox={L.viewBox}
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full"
        role="img"
        aria-label="Animated roadmap: topics move from cold to heating to forged along a central trunk."
      >
        <path className="f-trunk" d={L.trunk} />
        <path className="f-ember" d={L.trunk} />
        {L.links.map((l) => (
          <path key={l.id} className="f-link" data-phase={l.phase} d={l.d} />
        ))}
        {L.hubs.map((h) => (
          <g key={h.id} transform={`translate(${h.x} ${h.y})`}>
            <g className="f-hub-in" data-phase={h.phase}>
              <circle className="f-hub" r="9" />
              <text className="f-hub-label" y="-20" textAnchor="middle">
                {clip(h.label, 22)}
              </text>
            </g>
          </g>
        ))}
        {L.nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
            <g className="f-node-in" data-phase={n.phase}>
              <rect className="f-box" x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx="6" />
              <text className="f-label" x="-8" textAnchor="middle" dominantBaseline="central">
                {clip(n.label)}
              </text>
              <g transform={`translate(${NODE_W / 2 - 14} 0)`}>
                <path className="f-check" d="M-5 0 L-1.5 3.5 L5 -4" />
                <circle className="f-spark" r="6" />
              </g>
            </g>
          </g>
        ))}
      </svg>
      <button
        type="button"
        onClick={() => tlRef.current?.restart()}
        className="absolute right-0 top-0 rounded-md border border-black/[0.08] px-2 py-1 font-mono text-[11px] text-[var(--forge-muted)] hover:text-[var(--forge-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] dark:border-white/[0.08]"
      >
        replay
      </button>
    </figure>
  );
}
