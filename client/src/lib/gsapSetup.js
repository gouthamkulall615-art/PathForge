// Register GSAP plugins ONCE. Import { gsap, ScrollTrigger, useGSAP } from here everywhere.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

let registered = false;
export function setupGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Fonts change text metrics, so pins/starts must be recomputed once they load.
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  registered = true;
}
setupGsap();

export { gsap, ScrollTrigger, useGSAP };

// Read a resolved CSS variable (works with .dark on <html>).
export const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();
