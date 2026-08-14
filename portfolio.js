const projects = {
  iot: {
    image: "images/iot-monitoring-dashboard-public.png",
    alt: "经 AI 辅助脱敏的养殖场消毒除臭设备监管大屏",
    caption: "真实项目截图，经 AI 辅助脱敏 · 监管界面展示指标类型、日志区域与异常反馈结构。",
    type: "IOT 设备监管平台",
    title: "养殖场消毒除臭设备监管",
    summary: "将设备运行状态、在线态势、日志和异常信息组织为管理人员可快速判断的监控界面。",
    tags: ["设备状态", "实时监控", "事件日志", "数据可视化"],
    status: "公司项目 · 脱敏案例 · 源码不公开",
    statusClass: "project-status-company",
    link: "#case-iot",
  },
  erp: {
    image: "images/aquaculture-erp-public.png",
    alt: "经 AI 辅助脱敏的养殖渔业 ERP 数据大屏",
    caption: "真实项目截图，经 AI 辅助脱敏 · 养殖水质、投喂、设备自动化与经营模块的展示图。",
    type: "ERP / 低代码业务系统",
    title: "养殖渔业 ERP 业务闭环",
    summary: "把基础资料、库存、采购销售和设备相关流程，落到模块、字段、状态和单据核验路径。",
    tags: ["业务建模", "库存流程", "低代码", "验证记录"],
    status: "公司项目 · 脱敏案例 · 源码不公开",
    statusClass: "project-status-company",
    link: "#case-erp",
  },
  miniapp: {
    image: "images/esp32-miniapp-public.png",
    alt: "经 AI 辅助脱敏的养殖场消毒除臭设备管理总览小程序截图",
    caption: "真实项目截图，经 AI 辅助脱敏 · 管理总览汇集设备、在线状态、养殖户、预警与常用管理入口。",
    type: "ESP32 / 小程序端云协同",
    title: "消毒除臭设备管理小程序",
    summary: "在管理总览中呈现设备、预警与日常入口，并参与小程序、云端接口和 ESP32 状态反馈的协同链路。",
    tags: ["ESP32", "uni-app", "MQTT / HTTP", "状态反馈"],
    status: "公司项目 · 脱敏案例 · 源码不公开",
    statusClass: "project-status-company",
    link: "#case-miniapp",
  },
};

const image = document.querySelector("#project-image");
const caption = document.querySelector("#project-caption");
const type = document.querySelector("#project-type");
const projectStatus = document.querySelector("#project-status");
const title = document.querySelector("#project-title");
const summary = document.querySelector("#project-summary");
const tags = document.querySelector("#project-tags");
const link = document.querySelector("#project-link");
const tabs = document.querySelectorAll(".evidence-tab");
const evidenceStage = document.querySelector(".evidence-stage");
const techChain = document.querySelector(".tech-chain");
const techChainSignal = document.querySelector(".tech-chain-signal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function selectProject(key) {
  const project = projects[key];
  if (!project) return;

  const updateProject = () => {
    image.src = project.image;
    image.alt = project.alt;
    caption.textContent = project.caption;
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
if (window.location.hash === "#case-miniapp") selectProject("miniapp");

const radarFilters = document.querySelectorAll(".radar-filter");
const radarCards = document.querySelectorAll(".radar-card");
const radarCount = document.querySelector("#radar-count");

if (radarCount) radarCount.textContent = String(radarCards.length);

radarFilters.forEach((filter) => filter.addEventListener("click", () => {
  const selected = filter.dataset.filter;
  let visibleCount = 0;

  radarCards.forEach((card) => {
    const visible = selected === "all" || card.dataset.track.includes(selected);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  radarCount.textContent = String(visibleCount);
  radarFilters.forEach((item) => {
    const active = item === filter;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
}));

const revealTargets = document.querySelectorAll([
  ".section-heading",
  ".value-grid article",
  ".tech-chain-node",
  ".capability-proof-card",
  ".case-card",
  ".solution-brief",
  ".solution-steps li",
  ".agent-design-panel",
  ".agent-engineering-panel",
  ".source-map-column",
  ".radar-card",
  ".learning-card",
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

if (techChainSignal && reduceMotion) {
  techChainSignal.classList.add("is-static");
} else if (techChain && techChainSignal && "IntersectionObserver" in window) {
  const techChainObserver = new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    techChainSignal.classList.add("is-live");
    observer.disconnect();
  }, { rootMargin: "0px 0px -12%", threshold: 0.1 });
  techChainObserver.observe(techChain);
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
