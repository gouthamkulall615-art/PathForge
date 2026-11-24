// Pure layout for the mini Forge map. No React, no DOM.
// phases: [{ id, name, duration, topics: [string] }]
export const NODE_W = 132;
export const NODE_H = 30;
const PAD = 48;

export function layoutForge(phases, { vertical = false, perPhase = 4 } = {}) {
  const hubs = [], nodes = [], links = [];
  let cursor = 0;
  let extent = 0;

  phases.forEach((phase, i) => {
    const topics = phase.topics.slice(0, perPhase);
    const rows = Math.ceil(topics.length / 2);
    const hub = vertical ? { x: 0, y: cursor } : { x: cursor, y: 0 };
    hubs.push({ id: phase.id, phase: i, label: phase.name, duration: phase.duration, ...hub });

    topics.forEach((label, j) => {
      const side = j % 2 === 0 ? -1 : 1;       // alternate above/below (or left/right)
      const row = Math.floor(j / 2) + 1;
      let x, y, d;
      if (vertical) {
        x = side * (NODE_W / 2 + 56);
        y = hub.y + row * 46;
        d = `M0 ${hub.y} C${side * 30} ${hub.y} ${side * 24} ${y} ${side * 56} ${y}`;
      } else {
        const x0 = hub.x, x1 = hub.x + 90, mx = (x0 + x1) / 2;
        x = x1 + NODE_W / 2;
        y = side * row * 50;
        d = `M${x0} 0 C${mx} 0 ${mx} ${y} ${x1} ${y}`; // cubic S-curve
      }
      nodes.push({ id: `${phase.id}:${j}`, phase: i, label, x, y });
      links.push({ id: `${phase.id}:${j}`, phase: i, d });
    });

    extent = vertical ? hub.y + rows * 46 + 48 : hub.x + 90 + NODE_W + 48;
    cursor += vertical ? rows * 46 + 96 : 90 + NODE_W + 120;
  });

  const trunk = vertical ? `M0 0 L0 ${extent}` : `M0 0 L${extent} 0`;

  const xs = [0, ...hubs.map(h => h.x), ...nodes.flatMap(n => [n.x - NODE_W / 2, n.x + NODE_W / 2])];
  const ys = [0, ...hubs.map(h => h.y), ...nodes.flatMap(n => [n.y - NODE_H / 2, n.y + NODE_H / 2])];
  if (vertical) ys.push(extent); else xs.push(extent);
  const minX = Math.min(...xs) - PAD, maxX = Math.max(...xs) + PAD;
  const minY = Math.min(...ys) - PAD, maxY = Math.max(...ys) + PAD;

  return { hubs, nodes, links, trunk, viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}` };
}

// ADAPTER: edit ONLY this to match client/src/data/fields.js
export function toForgePhases(track, maxPhases = 3) {
  if (!track || !track.phases) return [];
  return track.phases.slice(0, maxPhases).map((p) => ({
    id: p.id,
    name: p.name ?? p.title,
    duration: p.duration ?? '',
    topics: (p.topics ?? []).map((t) => (typeof t === 'string' ? t : t.name)),
  }));
}
