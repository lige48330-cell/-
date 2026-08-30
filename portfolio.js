const projects = {
  iot: {
    image: "images/iot-monitoring-dashboard-public.png",
    alt: "经 AI 辅助脱敏的养殖场消毒除臭设备监管大屏",
    caption: "真实项目界面经 AI 辅助脱敏；大屏与小程序用于同一消毒除臭设备管理场景。",
    badge: "真实项目界面 · AI 辅助脱敏",
    type: "IOT / ESP32 协作 / 管理端",
    title: "消毒除臭设备联动",
    summary: "把团队提供的设备状态与事件组织到大屏和移动管理视图，支持运营判断与接口协作。",
    tags: ["状态 / 事件模型", "uni-app", "HTTP / MQTT", "接口协作"],
    status: "公司项目 · 脱敏可核对 · 源码不公开",
    statusClass: "project-status-company",
    link: "#case-iot",
  },
  erp: {
    image: "images/aquaculture-erp-public.png",
    alt: "经 AI 辅助脱敏的养殖渔业 ERP 界面",
    caption: "真实项目界面经 AI 辅助脱敏；客户、标识与业务数据已移除。",
    badge: "真实项目界面 · AI 辅助脱敏",
    type: "ERP / 业务建模与配置",
    title: "养殖渔业 ERP 业务闭环",
    summary: "把分散的业务口径落到对象、字段、状态与关键单据核验路径。",
    tags: ["业务建模", "字段状态", "低代码配置", "单据核验"],
    status: "公司项目 · 脱敏可核对 · 源码不公开",
    statusClass: "project-status-company",
    link: "#case-erp",
  },
  cockpit: {
    image: "images/cockpit-runtime-flow.svg",
    alt: "Cockpit Tools Provider 配置与运行态生命周期示意图",
    caption: "工程架构示意；基于已核验的私有分支改造与验证记录，不是产品运行截图。",
    badge: "工程架构示意 · 非运行截图",
    type: "TAURI / RUST / REACT 私有分支",
    title: "Cockpit Tools 运行态修复",
    summary: "修复 Provider 切换后的 gateway 生命周期、旧运行态与 API Key 账号边界不同步。",
    tags: ["Tauri / Rust", "React", "Go Sidecar", "Regression"],
    status: "私有分支 · 验证记录 · 源码不公开",
    statusClass: "project-status-private",
    link: "#case-cockpit-tools",
  },
};

const image = document.querySelector("#project-image");
const caption = document.querySelector("#project-caption");
const imageBadge = document.querySelector("#project-image-badge");
const type = document.querySelector("#project-type");
const projectStatus = document.querySelector("#project-status");
const title = document.querySelector("#project-title");
const summary = document.querySelector("#project-summary");
const tags = document.querySelector("#project-tags");
const link = document.querySelector("#project-link");
const tabs = document.querySelectorAll(".evidence-tab");
const evidenceStage = document.querySelector(".evidence-stage");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function selectProject(key) {
  const project = projects[key];
  if (!project) return;

  const updateProject = () => {
    image.src = project.image;
    image.alt = project.alt;
    caption.textContent = project.caption;
    if (imageBadge) imageBadge.textContent = project.badge;
    type.textContent = project.type;
    if (projectStatus) {
      projectStatus.textContent = project.status;
      projectStatus.className = `project-status ${project.statusClass}`;
    }
    title.textContent = project.title;
    summary.textContent = project.summary;
    link.href = project.link;
    tags.replaceChildren(...project.tags.map((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      return item;
    }));

    tabs.forEach((tab) => {
      const active = tab.dataset.project === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && evidenceStage) evidenceStage.setAttribute("aria-labelledby", tab.id);
    });
  };

  if (!reduceMotion && document.startViewTransition) {
    document.startViewTransition(updateProject);
  } else {
    updateProject();
  }

  if (evidenceStage && !reduceMotion) {
    evidenceStage.classList.remove("is-scanning");
    void evidenceStage.offsetWidth;
    evidenceStage.classList.add("is-scanning");
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectProject(tab.dataset.project));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0
      : event.key === "End" ? tabs.length - 1
      : (index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    nextTab.focus();
    selectProject(nextTab.dataset.project);
  });
});

if (window.location.hash === "#case-iot") selectProject("iot");
if (window.location.hash === "#case-cockpit-tools") selectProject("cockpit");

document.querySelectorAll(".mobile-nav a").forEach((item) => {
  item.addEventListener("click", () => {
    const menu = item.closest("details");
    if (menu) menu.open = false;
  });
});

const revealTargets = document.querySelectorAll([
  ".section-heading",
  ".flagship-case",
  ".delivery-spine li",
  ".responsibility-row",
  ".agent-contract-panel",
  ".trace-rag-copy",
  ".trace-rag-visual",
  ".trace-rag-chain li",
  ".local-project-feature",
  ".evidence-card",
  ".archive-item",
].join(","));

revealTargets.forEach((element, index) => {
  element.dataset.reveal = "";
  element.style.setProperty("--reveal-delay", `${(index % 4) * 55}ms`);
});

document.documentElement.classList.add("motion-ready");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

let progressFrame = 0;
function updateScrollProgress() {
  progressFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  document.documentElement.style.setProperty("--scroll-progress", String(progress));
}

window.addEventListener("scroll", () => {
  if (progressFrame) return;
  progressFrame = window.requestAnimationFrame(updateScrollProgress);
}, { passive: true });
updateScrollProgress();

const pointerTargets = document.querySelectorAll([
  ".project-control-room",
  ".flagship-case",
  ".agent-contract-panel",
  ".trace-rag-copy",
  ".trace-rag-visual",
  ".local-project-feature",
  ".evidence-card",
].join(","));
const pointerFine = window.matchMedia("(pointer: fine)").matches;

if (pointerFine && !reduceMotion) {
  pointerTargets.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      element.style.setProperty("--tilt-x", `${(x * 1.4).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(y * -1.4).toFixed(2)}deg`);
      element.classList.add("is-pointer-active");
    });
    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
      element.classList.remove("is-pointer-active");
    });
  });
}
