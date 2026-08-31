const cinematicVideos = document.querySelectorAll('.hero-video, .closing-hero-video');

cinematicVideos.forEach((video) => {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  const tryPlay = () => video.play().catch(() => {});
  video.addEventListener('canplay', tryPlay, { once: true });
  window.addEventListener('load', tryPlay, { once: true });
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) cinematicVideos.forEach((video) => video.play().catch(() => {}));
});

const closingHero = document.querySelector('.closing-hero');
const closingVideo = document.querySelector('.closing-hero-video');
if (closingHero && closingVideo) {
  const content = closingHero.querySelector('.closing-hero-content');
  const mark = closingHero.querySelector('.closing-mark');
  closingVideo.addEventListener('timeupdate', () => {
    if (!content) return;
    const duration = closingVideo.duration || 0;
    const show = closingVideo.currentTime < 5.5 || (duration && closingVideo.currentTime > duration - 4.5);
    content.style.opacity = show ? '1' : '0';
    content.style.transform = show ? 'translateY(-1vh)' : 'translateY(8px)';
    if (mark) mark.style.opacity = show ? '.9' : '0';
  });
}
