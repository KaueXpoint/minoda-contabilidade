export function mountBrandVideo(root, gsap, ScrollTrigger) {
  const video = root.querySelector('video');
  const button = root.querySelector('button');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  let manuallyPaused = false;
  let visible = false;
  const label = () => { button.textContent = video.paused ? 'Reproduzir vídeo' : 'Pausar vídeo'; button.setAttribute('aria-pressed', String(!video.paused)); };
  const load = () => { if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); } };
  const play = () => { load(); video.play().catch(label); };
  const sync = () => {
    if (visible && !document.hidden && !reduce.matches && !manuallyPaused && !navigator.connection?.saveData) play();
    else video.pause();
  };
  const toggle = () => { manuallyPaused = !video.paused; if (video.paused) play(); else video.pause(); };
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  button.addEventListener('click', toggle);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, {threshold:.25});
  observer.observe(video);
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(root.querySelector('.minoda-brand-film'), {y:24,opacity:.65}, {y:0,opacity:1,ease:'none',scrollTrigger:{trigger:root,start:'top 90%',end:'top 40%',scrub:true}});
  });
  return () => {observer.disconnect();media.revert();video.pause();video.removeEventListener('play',label);video.removeEventListener('pause',label);button.removeEventListener('click',toggle);document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',sync);};
}

export function revealBrand(loader, gsap, done) {
  if (window.__minodaLoader) {
    window.__minodaLoader.finish(gsap, done);
    return () => {};
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.dataset.loaded = 'true';
  const animation = gsap.to(loader, {
    yPercent: -100,
    duration: reduced ? 0.1 : 0.85,
    ease: 'power4.inOut',
    onComplete: done
  });
  return () => animation.kill();
}
