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
    erp: {
      image: "/-/images/smartagri-erp-public.png",
      alt: "AI 脱敏后的养殖渔业 ERP 数据大屏",
      caption: "真实项目截图 · AI 辅助脱敏 · 养殖水质、投喂、设备自动化与经营模块。",
      type: "COMPANY CASE / 脱敏",
      title: "养殖渔业 ERP 业务闭环",
      summary: "把基础资料、库存、采购销售和设备相关流程，落到模块、字段、状态和单据核验路径。",
      tags: ["业务建模", "库存流程", "低代码", "验证记录"],
      link: "#case-erp",
    },
    iot: {
      image: "/-/images/iot-monitoring-dashboard-public.png",
      alt: "AI 脱敏后的养殖场消毒除臭设备监管大屏",
      caption: "真实项目截图 · AI 辅助脱敏 · 指标类型、日志区域与异常反馈结构。",
      type: "COMPANY CASE / 脱敏",
      title: "养殖场消毒除臭设备监管",
      summary: "面向现场设备管理，把在线状态、运行记录、换水记录与异常事件整理为可读的监管视图。",
      tags: ["IoT 场景", "设备状态", "监控大屏", "可视化"],
      link: "#case-iot",
    },
    miniapp: {
      image: "/-/images/esp32-miniapp-public.png",
      alt: "AI 脱敏后的养殖场消毒除臭设备管理总览小程序截图",
      caption: "真实项目截图 · AI 辅助脱敏 · 聚合状态与常用入口。",
      type: "COMPANY CASE / 脱敏",
      title: "消毒除臭设备管理小程序",
      summary: "在管理总览中呈现设备、预警和养殖户概览，并参与小程序、云端接口与 ESP32 状态反馈的协同链路。",
      tags: ["ESP32", "uni-app", "MQTT / HTTP", "状态反馈"],
      link: "#case-miniapp",
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

  let currentTab = "erp";

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