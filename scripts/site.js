(() => {
  const yearTargets = document.querySelectorAll("[data-current-year]");
  for (const target of yearTargets) {
    target.textContent = String(new Date().getFullYear());
  }

  const localLinks = document.querySelectorAll('a[href^="#"]');
  for (const link of localLinks) {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    for (const target of targets) observer.observe(target);
  } else {
    for (const target of document.querySelectorAll(".fade-up")) {
      target.classList.add("visible");
    }
  }
})();