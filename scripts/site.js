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
})();
