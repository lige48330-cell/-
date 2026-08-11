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

  const projects = {
    esp32: {
      image: "/-/images/esp32-miniapp.png",
      alt: "ESP32 IoT 平台小程序界面",
      caption: "ESP32 设备、云平台与小程序协同的 IoT 监管界面。",
      type: "IoT / .NET 8 / uni-app",
      title: "ESP32 IoT 平台",
      summary: "面向智能消毒除臭设备的三端监管平台：ESP32 固件、自研 MQTT Broker、.NET 8 云平台与微信小程序。",
      tags: ["ESP32 固件", ".NET 8", "MQTT", "uni-app"],
    },
    supervisor: {
      image: "/-/images/agent-workflow.svg",
      alt: "AI Supervisor 工作流示意图",
      caption: "AI Supervisor 把规范、计划、审查与门禁串成可检查的交付流程。",
      type: "Python / CLI / Quality Gate",
      title: "AI Supervisor",
      summary: "审查 AI Agent 输出的质量门禁 CLI：spec / plan / review / guard / hook / doctor 命令与 MCP server。",
      tags: ["Python CLI", "Spec / Plan", "MCP Server", "pytest 93"],
    },
    aquaculture: {
      image: "/-/images/aquaculture-prototype-flow.svg",
      alt: "水产养殖应用架构示意图",
      caption: "H5、小程序壳与 Node 服务构成的三端全栈原型。",
      type: "Vue / uni-app / Express / Prisma",
      title: "智慧水产养殖应用套件",
      summary: "由 H5、微信小程序壳与 Node.js 服务组成的三端全栈原型，覆盖养殖、物料、设备和告警模块。",
      tags: ["Vue 3", "uni-app", "Express", "Prisma"],
    },
  };

  const image = document.querySelector("#project-image");
  const caption = document.querySelector("#project-caption");
  const type = document.querySelector("#project-type");
  const title = document.querySelector("#project-title");
  const summary = document.querySelector("#project-summary");
  const tags = document.querySelector("#project-tags");
  const tabs = document.querySelectorAll(".evidence-tab");

  function selectProject(key) {
    const project = projects[key];
    if (!project) return;
    image.src = project.image;
    image.alt = project.alt;
    caption.textContent = project.caption;
    type.textContent = project.type;
    title.textContent = project.title;
    summary.textContent = project.summary;
    tags.replaceChildren(...project.tags.map((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      return item;
    }));
    tabs.forEach((tab) => {
      const active = tab.dataset.project === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => selectProject(tab.dataset.project)));

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
      { threshold: 0.1 }
    );
    for (const target of targets) observer.observe(target);
  } else {
    for (const target of document.querySelectorAll(".fade-up")) {
      target.classList.add("visible");
    }
  }
})();