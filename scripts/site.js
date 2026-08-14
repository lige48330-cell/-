(() => {
  for (const el of document.querySelectorAll("[data-current-year]")) {
    el.textContent = String(new Date().getFullYear());
  }

  for (const link of document.querySelectorAll('a[href^="#"]')) {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const projects = {
    codexcont: {
      image: "/-/images/codexcont-flow.svg",
      alt: "CodexCont 流式中间件架构示意图",
      caption: "CodexCont：客户端与 OpenAI Codex 上游之间的流式转发中间件。",
      type: "PRODUCT / AI 中间件",
      title: "CodexCont 流式中间件",
      summary: "Python / Starlette / SSE 实现的流式转发层，负责客户端与上游 Codex 之间的协议适配与状态透传。",
      tags: ["Python", "Starlette", "SSE", "离线测试全通"],
      link: "#case-codexcont",
    },
    stack: {
      image: "/-/images/code-control-stack.svg",
      alt: "Code Control Stack 分层控制架构示意图",
      caption: "Code Control Stack：规则、模板、闸门、Agent 与工件五层控制架构。",
      type: "METHOD / 工程方法",
      title: "Code Control Stack",
      summary: "分层控制架构：把规范、模板、闸门与复盘固化为可复用方法，对照实验量化工程改进。",
      tags: ["YAML", "Markdown", "对照实验", "可复现"],
      link: "#case-stack",
    },
    stablefirst: {
      image: "/-/images/stable-first-workflow.svg",
      alt: "Stable-First 工作流六阶段闸门示意图",
      caption: "Stable-First：需求→方案→计划→实现→审查→复盘，六阶段闸门全部通过。",
      type: "METHOD / 工作流",
      title: "Stable-First 工作流",
      summary: "六阶段闸门工作流：需求→方案→计划→实现→审查→复盘，每阶段有明确检查标准。",
      tags: ["模板化", "自动化门禁", "可审查", "复盘归档"],
      link: "#case-stablefirst",
    },
  };

  const image = document.querySelector("#project-image");
  const caption = document.querySelector("#project-caption");
  const type = document.querySelector("#project-type");
  const title = document.querySelector("#project-title");
  const summary = document.querySelector("#project-summary");
  const tags = document.querySelector("#project-tags");
  const link = document.querySelector("#project-link");
  const tabs = document.querySelectorAll(".evidence-tab");

  let currentTab = "codexcont";

  function selectProject(key) {
    const project = projects[key];
    if (!project) return;
    currentTab = key;
    image.src = project.image;
    image.alt = project.alt;
    caption.textContent = project.caption;
    type.textContent = project.type;
    title.textContent = project.title;
    summary.textContent = project.summary;
    link.href = project.link;
    tags.replaceChildren(...project.tags.map((t) => {
      const item = document.createElement("li");
      item.textContent = t;
      return item;
    }));
    tabs.forEach((tab) => {
      const active = tab.dataset.project === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => selectProject(tab.dataset.project)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const keys = Object.keys(projects);
      const idx = keys.indexOf(currentTab);
      if (idx === -1) return;
      const next = e.key === "ArrowLeft" ? (idx - 1 + keys.length) % keys.length : (idx + 1) % keys.length;
      selectProject(keys[next]);
      tabs[next]?.focus();
    }
  });

  const filters = document.querySelectorAll(".radar-filter");
  const cards = document.querySelectorAll(".radar-card");
  const count = document.querySelector("#radar-count");

  if (filters.length && count) {
    filters.forEach((filter) => filter.addEventListener("click", () => {
      const selected = filter.dataset.filter;
      let visible = 0;
      cards.forEach((card) => {
        const match = selected === "all" || (card.dataset.track || "").includes(selected);
        card.hidden = !match;
        if (match) visible++;
      });
      count.textContent = String(visible);
      filters.forEach((f) => {
        const active = f === filter;
        f.classList.toggle("is-active", active);
        f.setAttribute("aria-pressed", String(active));
      });
    }));
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(".section-block, .value-proposition");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 }
    );
    for (const target of targets) observer.observe(target);
  } else {
    for (const el of document.querySelectorAll(".section-block, .value-proposition")) {
      el.classList.add("fade-up");
    }
  }
})();