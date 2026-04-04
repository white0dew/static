const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// 页面滚动时显示区块动画
const revealNodes = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealNodes.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("visible"));
}

// 文章页阅读进度条
const progressBar = document.querySelector("[data-reading-progress]");
if (progressBar) {
  const updateProgress = () => {
    const root = document.documentElement;
    const total = root.scrollHeight - root.clientHeight;
    const ratio = total > 0 ? root.scrollTop / total : 0;
    progressBar.style.transform = `scaleX(${Math.max(0, Math.min(1, ratio))})`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}
