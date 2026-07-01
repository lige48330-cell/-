(function initLiquidGlass() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointerTargets = document.querySelectorAll("[data-lg-pointer]");

  function setPointerVars(element, event) {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    element.style.setProperty("--lg-pointer-x", `${x.toFixed(2)}%`);
    element.style.setProperty("--lg-pointer-y", `${y.toFixed(2)}%`);

    if (element.dataset.lgPointer === "tilt" && !prefersReducedMotion) {
      const rotateY = ((x - 50) / 50) * 4;
      const rotateX = ((50 - y) / 50) * 4;
      element.style.setProperty("--lg-rotate-x", `${rotateX.toFixed(2)}deg`);
      element.style.setProperty("--lg-rotate-y", `${rotateY.toFixed(2)}deg`);
    }
  }

  pointerTargets.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      element.classList.add("lg-pointer-active");
      setPointerVars(element, event);
    });

    element.addEventListener("pointerleave", () => {
      element.classList.remove("lg-pointer-active");
      element.style.removeProperty("--lg-rotate-x");
      element.style.removeProperty("--lg-rotate-y");
      element.style.setProperty("--lg-pointer-x", "50%");
      element.style.setProperty("--lg-pointer-y", "50%");
    });
  });

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.animate(
              [
                { opacity: 0, transform: "translateY(18px) scale(0.985)" },
                { opacity: 1, transform: "translateY(0) scale(1)" },
              ],
              { duration: 520, easing: "cubic-bezier(.2,.75,.18,1)", fill: "both" }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".lg-card, .lg-surface").forEach((element) => observer.observe(element));
  }
})();
