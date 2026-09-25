// Original Minoda timeline, inspired by React Bits Scroll Reveal and
// 21st.dev's Container Scroll Animation. Uses the site's existing GSAP.
export function mountTaxComparison(root, gsap, ScrollTrigger) {
  if (!root) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const query = window.matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 480px)');
  const story = root.querySelector('.minoda-tax-story');
  const chart = root.querySelector('.minoda-tax-chart');
  const chapters = [...root.querySelectorAll('.minoda-tax-chapter')];
  const buttons = [...root.querySelectorAll('[data-tax-step]')];
  const label = root.querySelector('.minoda-tax-live-label');
  let alive = true;

  const setup = () => {
    root.classList.add('minoda-tax-enhanced');
    let step = -1;
    let removeListeners = () => {};
    const setStep = value => {
      if (value === step) return;
      step = value;
      root.dataset.taxStep = String(value);
      label.textContent = ['Sem planejamento', 'Análise tributária', 'Com planejamento'][value];
      chapters.forEach((chapter, index) => chapter.setAttribute('aria-hidden', String(index !== value)));
      buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === value)));
    };
    setStep(0);
    const context = gsap.context(() => {
      gsap.set(chapters.slice(1), { autoAlpha: 0, y: 18 });
      gsap.set('.minoda-tax-after', { opacity: 0 });
      gsap.set('.minoda-tax-after .minoda-tax-columns i', {
        scaleY: index => [78 / 43, 95 / 38, 85 / 49, 91 / 36, 74 / 41, 88 / 32][index],
        transformOrigin: '50% 100%'
      });
      gsap.set('.minoda-tax-ghosts', { opacity: 0 });
      gsap.set('.minoda-tax-scan', { autoAlpha: 0, xPercent: -110 });
      gsap.set('.minoda-tax-progress span', { scaleX: 0, transformOrigin: '0% 50%' });
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'minoda-tax-comparison', trigger: story,
          start: () => `top ${getComputedStyle(root.querySelector('.minoda-tax-sticky')).top}`,
          end: () => `+=${story.offsetHeight - root.querySelector('.minoda-tax-sticky').offsetHeight}`,
          scrub: 0.35, invalidateOnRefresh: true,
          onToggle: self => document.documentElement.classList.toggle('minoda-tax-in-view', self.isActive)
        },
        onUpdate() { const p = this.progress(); setStep(p < 0.3 ? 0 : p < 0.68 ? 1 : 2); }
      });
      timeline
        .fromTo(chart, { rotationX: 5, y: 18, transformPerspective: 1100 }, { rotationX: 0, y: 0, duration: 0.2 }, 0)
        .to(chapters[0], { autoAlpha: 0, y: -16, duration: 0.08 }, 0.25)
        .to(chapters[1], { autoAlpha: 1, y: 0, duration: 0.08 }, 0.3)
        .to('.minoda-tax-scan', { autoAlpha: 1, duration: 0.04 }, 0.32)
        .to('.minoda-tax-scan', { xPercent: 110, duration: 0.27 }, 0.34)
        .to('.minoda-tax-scan', { autoAlpha: 0, duration: 0.04 }, 0.61)
        .to('.minoda-tax-ghosts', { opacity: 1, duration: 0.12 }, 0.48)
        .to('.minoda-tax-before', { opacity: 0, duration: 0.16 }, 0.5)
        .to('.minoda-tax-after', { opacity: 1, duration: 0.16 }, 0.5)
        .to('.minoda-tax-after .minoda-tax-columns i', { scaleY: 1, duration: 0.25, stagger: 0.025 }, 0.53)
        .to(chapters[1], { autoAlpha: 0, y: -16, duration: 0.08 }, 0.63)
        .to(chapters[2], { autoAlpha: 1, y: 0, duration: 0.08 }, 0.68)
        .to('.minoda-tax-progress span', { scaleX: 1, duration: 1 }, 0);
      const positions = [0.12, 0.44, 0.92];
      const cleanups = buttons.map((button, index) => {
        const handler = () => {
          const trigger = timeline.scrollTrigger;
          window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * positions[index], behavior: 'instant' });
          ScrollTrigger.update();
        };
        button.addEventListener('click', handler);
        return () => button.removeEventListener('click', handler);
      });
      removeListeners = () => cleanups.forEach(clean => clean());
    }, root);
    return () => {
      removeListeners();
      context.revert();
      root.classList.remove('minoda-tax-enhanced');
      delete root.dataset.taxStep;
      chapters.forEach(chapter => chapter.removeAttribute('aria-hidden'));
      label.textContent = 'Comparativo';
      document.documentElement.classList.remove('minoda-tax-in-view');
    };
  };
  let stop;
  const sync = () => { stop?.(); stop = query.matches ? setup() : undefined; };
  query.addEventListener('change', sync);
  sync();
  const refresh = () => { if (alive) ScrollTrigger.refresh(); };
  document.fonts?.ready.then(refresh);
  const frame = requestAnimationFrame(refresh);
  return () => { alive = false; cancelAnimationFrame(frame); query.removeEventListener('change', sync); stop?.(); };
}
