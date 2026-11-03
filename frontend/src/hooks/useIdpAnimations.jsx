import { useEffect } from "react";

const presets = {
        'animate-idp-grid': {
          keyframes: [{ backgroundPosition: '0px 0px' }, { backgroundPosition: '26px 26px' }],
          duration: 9000, easing: 'linear', iterations: Infinity
        },
        'animate-idp-sweep': {
          keyframes: [{ transform: 'translateX(-130%) skewX(-14deg)' }, { transform: 'translateX(430%) skewX(-14deg)' }],
          duration: 7000, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-glow': {
          keyframes: [
            { offset: 0, opacity: 0.35, scale: '0.9' },
            { offset: 0.5, opacity: 0.75, scale: '1.12' },
            { offset: 1, opacity: 0.35, scale: '0.9' }
          ],
          duration: 4500, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-float-1': {
          keyframes: [
            { offset: 0, transform: 'translateY(0)', opacity: 0.15 },
            { offset: 0.5, transform: 'translateY(-12px)', opacity: 0.95 },
            { offset: 1, transform: 'translateY(0)', opacity: 0.15 }
          ],
          duration: 5000, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-float-2': {
          keyframes: [
            { offset: 0, transform: 'translateY(0)', opacity: 0.15 },
            { offset: 0.5, transform: 'translateY(-12px)', opacity: 0.95 },
            { offset: 1, transform: 'translateY(0)', opacity: 0.15 }
          ],
          duration: 6000, delay: -1500, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-float-3': {
          keyframes: [
            { offset: 0, transform: 'translateY(0)', opacity: 0.15 },
            { offset: 0.5, transform: 'translateY(-12px)', opacity: 0.95 },
            { offset: 1, transform: 'translateY(0)', opacity: 0.15 }
          ],
          duration: 7000, delay: -3000, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-float-4': {
          keyframes: [
            { offset: 0, transform: 'translateY(0)', opacity: 0.15 },
            { offset: 0.5, transform: 'translateY(-12px)', opacity: 0.95 },
            { offset: 1, transform: 'translateY(0)', opacity: 0.15 }
          ],
          duration: 5500, delay: -2000, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-float-5': {
          keyframes: [
            { offset: 0, transform: 'translateY(0)', opacity: 0.15 },
            { offset: 0.5, transform: 'translateY(-12px)', opacity: 0.95 },
            { offset: 1, transform: 'translateY(0)', opacity: 0.15 }
          ],
          duration: 6500, delay: -4000, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-float-6': {
          keyframes: [
            { offset: 0, transform: 'translateY(0)', opacity: 0.15 },
            { offset: 0.5, transform: 'translateY(-12px)', opacity: 0.95 },
            { offset: 1, transform: 'translateY(0)', opacity: 0.15 }
          ],
          duration: 8000, delay: -1000, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-shine': {
          keyframes: [{ backgroundPosition: '0% 0%' }, { backgroundPosition: '200% 0%' }],
          duration: 6000, easing: 'linear', iterations: Infinity
        },
        'animate-idp-wave': {
          keyframes: [
            { offset: 0, rotate: '0deg' },
            { offset: 0.1, rotate: '14deg' },
            { offset: 0.2, rotate: '-8deg' },
            { offset: 0.3, rotate: '14deg' },
            { offset: 0.4, rotate: '-4deg' },
            { offset: 0.5, rotate: '10deg' },
            { offset: 0.6, rotate: '0deg' },
            { offset: 1, rotate: '0deg' }
          ],
          duration: 2600, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-banner-pulse': {
          keyframes: [
            { offset: 0, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.035), 0 0 0 rgba(34,211,238,0)', backgroundPosition: '0% 50%' },
            { offset: 0.5, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08), 0 0 22px rgba(34,211,238,.12)', backgroundPosition: '100% 50%' },
            { offset: 1, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.035), 0 0 0 rgba(34,211,238,0)', backgroundPosition: '0% 50%' }
          ],
          duration: 9000, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-text-rise': {
          keyframes: [{ opacity: 0, translate: '0px 8px' }, { opacity: 1, translate: '0px 0px' }],
          duration: 850, easing: 'ease-out', iterations: 1, fill: 'both'
        },
        'animate-idp-text-rise-delayed': {
          keyframes: [{ opacity: 0, translate: '0px 8px' }, { opacity: 1, translate: '0px 0px' }],
          duration: 1000, delay: 180, easing: 'ease-out', iterations: 1, fill: 'both'
        },
        'animate-idp-art-glow': {
          keyframes: [
            { offset: 0, filter: 'drop-shadow(0 0 5px rgba(56,189,248,.35))', opacity: 0.94 },
            { offset: 0.5, filter: 'drop-shadow(0 0 12px rgba(56,189,248,.6))', opacity: 1 },
            { offset: 1, filter: 'drop-shadow(0 0 5px rgba(56,189,248,.35))', opacity: 0.94 }
          ],
          duration: 5000, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-doc-hover': {
          keyframes: [
            { offset: 0, translate: '0px 0px', filter: 'drop-shadow(0 0 5px rgba(34,211,238,.32))' },
            { offset: 0.5, translate: '0px -3px', filter: 'drop-shadow(0 0 10px rgba(34,211,238,.62))' },
            { offset: 1, translate: '0px 0px', filter: 'drop-shadow(0 0 5px rgba(34,211,238,.32))' }
          ],
          duration: 4800, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-badge-hover-1': {
          keyframes: [{ translate: '0px 0px' }, { translate: '0px -2px' }, { translate: '0px 0px' }],
          duration: 3800, delay: 100, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-badge-hover-2': {
          keyframes: [{ translate: '0px 0px' }, { translate: '0px -2px' }, { translate: '0px 0px' }],
          duration: 4200, delay: 550, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-badge-hover-3': {
          keyframes: [{ translate: '0px 0px' }, { translate: '0px -2px' }, { translate: '0px 0px' }],
          duration: 4000, delay: 1000, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-data-flow': {
          keyframes: [{ strokeDashoffset: 0 }, { strokeDashoffset: -100 }],
          duration: 2200, easing: 'linear', iterations: Infinity
        },
        'animate-idp-data-flow-slow': {
          keyframes: [{ strokeDashoffset: 0 }, { strokeDashoffset: -100 }],
          duration: 2800, delay: -800, easing: 'linear', iterations: Infinity
        },
        'animate-idp-data-flow-medium': {
          keyframes: [{ strokeDashoffset: 0 }, { strokeDashoffset: -100 }],
          duration: 2500, delay: -1400, easing: 'linear', iterations: Infinity
        },
        'animate-idp-ring-turn': {
          keyframes: [{ rotate: '0deg' }, { rotate: '360deg' }],
          duration: 12000, easing: 'linear', iterations: Infinity
        },
        'animate-idp-ring-turn-reverse': {
          keyframes: [{ rotate: '0deg' }, { rotate: '-360deg' }],
          duration: 18000, easing: 'linear', iterations: Infinity
        },
        'animate-idp-ripple': {
          keyframes: [
            { offset: 0, opacity: 0.24, scale: '0.94' },
            { offset: 0.5, opacity: 0.75, scale: '1.035' },
            { offset: 1, opacity: 0.24, scale: '0.94' }
          ],
          duration: 3200, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-ripple-delayed': {
          keyframes: [
            { offset: 0, opacity: 0.24, scale: '0.94' },
            { offset: 0.5, opacity: 0.75, scale: '1.035' },
            { offset: 1, opacity: 0.24, scale: '0.94' }
          ],
          duration: 3200, delay: -1600, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-processor-pulse': {
          keyframes: [{ opacity: 0.92 }, { opacity: 1 }, { opacity: 0.92 }],
          duration: 3800, easing: 'ease-in-out', iterations: Infinity
        },
        'animate-idp-chip-scan': {
          keyframes: [
            { offset: 0, opacity: 0.8, filter: 'drop-shadow(0 0 2px rgba(103,232,249,.25))' },
            { offset: 0.5, opacity: 1, filter: 'drop-shadow(0 0 7px rgba(103,232,249,.85))' },
            { offset: 1, opacity: 0.8, filter: 'drop-shadow(0 0 2px rgba(103,232,249,.25))' }
          ],
          duration: 3200, easing: 'ease-in-out', iterations: Infinity
        }
      };

export default function useIdpAnimations(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof Element === "undefined" || !Element.prototype.animate) return undefined;
    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let activeAnimations = [];
    const stopAnimations = () => {
      activeAnimations.forEach((animation) => animation.cancel());
      activeAnimations = [];
    };
    const startAnimations = () => {
      if (motionQuery?.matches) return;
      Object.entries(presets).forEach(([className, config]) => {
        root.querySelectorAll(`.${className}`).forEach((element) => {
          const animation = element.animate(config.keyframes, {
            duration: config.duration,
            delay: config.delay || 0,
            easing: config.easing || "linear",
            iterations: config.iterations || 1,
            fill: config.fill || "none",
          });
          activeAnimations.push(animation);
        });
      });
    };
    const handleMotionChange = (event) => { stopAnimations(); if (!event.matches) startAnimations(); };
    startAnimations();
    motionQuery?.addEventListener?.("change", handleMotionChange);
    return () => {
      stopAnimations();
      motionQuery?.removeEventListener?.("change", handleMotionChange);
    };
  }, [rootRef]);
}
