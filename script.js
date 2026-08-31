const video = document.querySelector('.hero-video');
if (video) {
  video.muted = true;
  const tryPlay = () => video.play().catch(() => {});
  window.addEventListener('load', tryPlay);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
}
