# Developer Profile Miniapp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 uni-app + Vue3 展示型小程序，用于介绍专业小程序开发者服务，并通过静态咨询表单引导客户联系。

**Architecture:** 单页静态应用，所有展示内容放在页面内的本地数据数组中，表单只做前端交互提示，不保存、不上传、不调用接口。项目不接登录、不接后端、不接云开发，避免隐私采集和平台能力依赖。

**Tech Stack:** uni-app + Vue3、Vue SFC、SCSS/CSS、静态页面状态。

---

## File Structure

- Create: `package.json` — 项目脚本和开发依赖声明。
- Create: `index.html` — uni-app H5/Vite 入口。
- Create: `src/main.js` — 创建 Vue 应用并挂载 uni-app。
- Create: `src/App.vue` — 应用入口样式容器。
- Create: `src/pages.json` — 小程序页面配置，仅首页。
- Create: `src/manifest.json` — uni-app 应用配置。
- Create: `src/pages/index/index.vue` — 首页全部 UI、静态内容、静态咨询表单。
- Create: `README.md` — 项目说明、隐私边界、运行方式。

## Task 1: Create uni-app project skeleton

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`
- Create: `src/pages.json`
- Create: `src/manifest.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "developer-profile-miniapp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:h5": "uni -p h5",
    "build:h5": "uni build -p h5",
    "dev:mp-weixin": "uni -p mp-weixin",
    "build:mp-weixin": "uni build -p mp-weixin"
  },
  "dependencies": {
    "@dcloudio/uni-app": "latest",
    "@dcloudio/uni-components": "latest",
    "@dcloudio/uni-h5": "latest",
    "@dcloudio/uni-mp-weixin": "latest",
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@dcloudio/vite-plugin-uni": "latest",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create `index.html`**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>专业小程序开发者</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 3: Create `src/main.js`**

```js
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
```

- [ ] **Step 4: Create `src/App.vue`**

```vue
<script setup>
</script>

<style>
page {
  background: #f6f8fb;
  color: #172033;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
```

- [ ] **Step 5: Create `src/pages.json`**

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "小程序开发方案",
        "navigationBarBackgroundColor": "#0f172a",
        "navigationBarTextStyle": "white"
      }
    }
  ],
  "globalStyle": {
    "backgroundColor": "#f6f8fb",
    "navigationBarBackgroundColor": "#0f172a",
    "navigationBarTextStyle": "white"
  }
}
```

- [ ] **Step 6: Create `src/manifest.json`**

```json
{
  "name": "专业小程序开发者",
  "appid": "",
  "description": "展示小程序开发服务与解决方案的静态小程序",
  "versionName": "0.1.0",
  "versionCode": "1",
  "transformPx": false,
  "mp-weixin": {
    "appid": "",
    "setting": {
      "urlCheck": false
    },
    "usingComponents": true
  }
}
```

- [ ] **Step 7: Verify skeleton files exist**

Run:

```bash
python - <<'PY'
from pathlib import Path
root = Path('D:/AI/小程序/developer-profile-miniapp')
files = ['package.json', 'index.html', 'src/main.js', 'src/App.vue', 'src/pages.json', 'src/manifest.json']
for file in files:
    path = root / file
    print(file, 'PASS' if path.exists() else 'FAIL')
PY
```

Expected: every line prints `PASS`.

---

## Task 2: Build the single-page developer profile UI

**Files:**
- Create: `src/pages/index/index.vue`

- [ ] **Step 1: Create `src/pages/index/index.vue` with complete static page**

```vue
<script setup>
import { reactive } from 'vue'

const services = [
  { title: '基础 CRUD 系统', desc: '列表、详情、新增、编辑、禁用、搜索筛选与分页。' },
  { title: '多级分类 / 筛选', desc: '区域、门店、商品、设备、内容分类等复杂层级建模。' },
  { title: '权限与角色管理', desc: '管理员、运营、店长、员工等多角色数据隔离。' },
  { title: '订单 / 预约 / 工单流程', desc: '状态流转、审批、提醒、日志和异常处理。' },
  { title: '设备控制 / IoT 对接', desc: '控制命令、回执、超时、审计和安全确认链路。' },
  { title: '小程序 + 后台管理', desc: '前端小程序、管理后台、后端 API 的完整方案。' }
]

const solutions = [
  '门店管理小程序',
  '商品/电商小程序',
  '预约服务小程序',
  '内容展示小程序',
  '设备管理小程序',
  '企业内部管理小程序'
]

const steps = [
  '需求沟通',
  '方案设计',
  'UI 与交互',
  '开发联调',
  '测试上线',
  '后续维护'
]

const form = reactive({
  type: '门店管理',
  budget: '待沟通',
  description: ''
})

function submitConsultation() {
  uni.showModal({
    title: '请直接联系我',
    content: '当前表单不会保存或上传任何信息。请通过微信或电话联系，我会根据你的需求提供方案。',
    showCancel: false,
    confirmText: '知道了'
  })
}
</script>

<template>
  <scroll-view scroll-y class="page">
    <view class="hero section">
      <view class="eyebrow">MINI PROGRAM DEVELOPER</view>
      <text class="hero-title">专业小程序开发者</text>
      <text class="hero-subtitle">从需求分析、原型设计到开发上线，为门店、企业、内容、电商和设备场景提供完整小程序解决方案。</text>
      <view class="hero-actions">
        <button class="primary-button" @click="submitConsultation">立即咨询</button>
        <button class="ghost-button">查看服务</button>
      </view>
    </view>

    <view class="section">
      <view class="section-heading">
        <text class="section-title">我能解决什么</text>
        <text class="section-desc">不只是做页面，更关注业务闭环、权限边界和可验证交付。</text>
      </view>
      <view class="service-grid">
        <view v-for="item in services" :key="item.title" class="service-card">
          <text class="card-title">{{ item.title }}</text>
          <text class="card-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <view class="section dark-section">
      <view class="section-heading">
        <text class="section-title light">常见解决方案</text>
        <text class="section-desc light-muted">根据你的业务选择最小可用方案，再逐步扩展。</text>
      </view>
      <view class="solution-list">
        <view v-for="item in solutions" :key="item" class="solution-pill">{{ item }}</view>
      </view>
    </view>

    <view class="section">
      <view class="section-heading">
        <text class="section-title">开发流程</text>
        <text class="section-desc">先设计，再实现；先验证，再上线。</text>
      </view>
      <view class="timeline">
        <view v-for="(step, index) in steps" :key="step" class="timeline-item">
          <view class="timeline-index">{{ index + 1 }}</view>
          <text class="timeline-text">{{ step }}</text>
        </view>
      </view>
    </view>

    <view class="section consult-card">
      <view class="section-heading">
        <text class="section-title">咨询你的项目</text>
        <text class="section-desc">这个表单只用于帮你整理思路，不会保存或上传。</text>
      </view>
      <view class="form-block">
        <text class="label">项目类型</text>
        <picker :range="['门店管理', '电商商品', '预约服务', '内容展示', '设备管理', '企业管理']" @change="event => form.type = ['门店管理', '电商商品', '预约服务', '内容展示', '设备管理', '企业管理'][event.detail.value]">
          <view class="picker-value">{{ form.type }}</view>
        </picker>
      </view>
      <view class="form-block">
        <text class="label">预算范围</text>
        <picker :range="['待沟通', '基础版', '标准版', '定制版']" @change="event => form.budget = ['待沟通', '基础版', '标准版', '定制版'][event.detail.value]">
          <view class="picker-value">{{ form.budget }}</view>
        </picker>
      </view>
      <view class="form-block">
        <text class="label">需求描述</text>
        <textarea v-model="form.description" class="textarea" placeholder="例如：我想做一个门店预约小程序，需要员工排班、订单管理和客户提醒。" />
      </view>
      <button class="primary-button full" @click="submitConsultation">生成咨询提示</button>
      <text class="privacy-note">隐私说明：本页面不登录、不采集 openid、不保存手机号、不上传表单内容。</text>
    </view>

    <view class="section contact-section">
      <text class="section-title">联系我</text>
      <text class="contact-line">微信：请替换为你的微信号</text>
      <text class="contact-line">电话：请替换为你的联系电话</text>
      <text class="contact-desc">如果你有小程序开发、业务系统设计、后台管理、IoT 控制或多端适配需求，可以直接联系我沟通方案。</text>
    </view>
  </scroll-view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
}

.section {
  margin: 24rpx;
  padding: 36rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 18rpx 50rpx rgba(15, 23, 42, 0.08);
}

.hero {
  padding: 56rpx 40rpx;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
  color: #ffffff;
}

.eyebrow {
  display: inline-flex;
  margin-bottom: 20rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.14);
  color: #bfdbfe;
  font-size: 22rpx;
  letter-spacing: 2rpx;
}

.hero-title {
  display: block;
  font-size: 52rpx;
  font-weight: 800;
  line-height: 1.15;
}

.hero-subtitle {
  display: block;
  margin-top: 22rpx;
  color: #dbeafe;
  font-size: 28rpx;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 36rpx;
}

.primary-button,
.ghost-button {
  margin: 0;
  border-radius: 999rpx;
  font-size: 28rpx;
}

.primary-button {
  background: #2563eb;
  color: #ffffff;
}

.ghost-button {
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  background: transparent;
  color: #ffffff;
}

.full {
  width: 100%;
  margin-top: 28rpx;
}

.section-heading {
  margin-bottom: 28rpx;
}

.section-title {
  display: block;
  color: #0f172a;
  font-size: 36rpx;
  font-weight: 800;
}

.section-desc {
  display: block;
  margin-top: 10rpx;
  color: #64748b;
  font-size: 26rpx;
  line-height: 1.6;
}

.light {
  color: #ffffff;
}

.light-muted {
  color: #cbd5e1;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.service-card {
  padding: 24rpx;
  border: 1rpx solid #e2e8f0;
  border-radius: 22rpx;
  background: #f8fafc;
}

.card-title {
  display: block;
  color: #172033;
  font-size: 28rpx;
  font-weight: 700;
}

.card-desc {
  display: block;
  margin-top: 10rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 1.55;
}

.dark-section {
  background: #111827;
}

.solution-list {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
}

.solution-pill {
  padding: 16rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(59, 130, 246, 0.16);
  color: #bfdbfe;
  font-size: 26rpx;
}

.timeline {
  display: grid;
  gap: 18rpx;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.timeline-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 800;
}

.timeline-text {
  color: #334155;
  font-size: 28rpx;
}

.consult-card {
  border: 2rpx solid #bfdbfe;
}

.form-block {
  margin-top: 24rpx;
}

.label {
  display: block;
  margin-bottom: 12rpx;
  color: #334155;
  font-size: 26rpx;
  font-weight: 700;
}

.picker-value,
.textarea {
  box-sizing: border-box;
  width: 100%;
  border: 1rpx solid #cbd5e1;
  border-radius: 18rpx;
  background: #ffffff;
  color: #0f172a;
  font-size: 26rpx;
}

.picker-value {
  padding: 22rpx;
}

.textarea {
  min-height: 180rpx;
  padding: 22rpx;
}

.privacy-note {
  display: block;
  margin-top: 20rpx;
  color: #64748b;
  font-size: 24rpx;
  line-height: 1.5;
}

.contact-section {
  margin-bottom: 48rpx;
}

.contact-line {
  display: block;
  margin-top: 18rpx;
  color: #1d4ed8;
  font-size: 30rpx;
  font-weight: 700;
}

.contact-desc {
  display: block;
  margin-top: 18rpx;
  color: #475569;
  font-size: 26rpx;
  line-height: 1.7;
}
</style>
```

- [ ] **Step 2: Verify page avoids network and privacy APIs**

Run:

```bash
python - <<'PY'
from pathlib import Path
path = Path('D:/AI/小程序/developer-profile-miniapp/src/pages/index/index.vue')
text = path.read_text(encoding='utf-8')
blocked = ['request(', 'uni.request', 'wx.login', 'getUserProfile', 'getPhoneNumber', 'cloud']
for item in blocked:
    print(item, 'FAIL' if item in text else 'PASS')
PY
```

Expected: every line prints `PASS`.

---

## Task 3: Add project documentation

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# 专业小程序开发者展示小程序

这是一个 uni-app + Vue3 展示型小程序，用于介绍小程序开发服务、解决方案和咨询方式。

## 功能

- 专业开发者介绍
- 小程序开发能力展示
- 常见解决方案展示
- 开发流程说明
- 静态咨询表单
- 联系方式展示

## 隐私边界

本项目当前版本：

- 不登录
- 不采集 openid
- 不采集手机号
- 不采集头像或昵称
- 不上传表单内容
- 不连接后端 API
- 不使用云开发或数据库

咨询表单只用于页面交互提示，点击提交后会提示用户通过微信或电话联系。

## 运行

安装依赖：

```bash
npm install
```

H5 预览：

```bash
npm run dev:h5
```

微信小程序构建：

```bash
npm run build:mp-weixin
```

如果本机没有 uni-app CLI 或依赖安装失败，需要先根据 DCloud 官方文档配置 uni-app 开发环境。
```

- [ ] **Step 2: Verify README states privacy boundary**

Run:

```bash
python - <<'PY'
from pathlib import Path
text = Path('D:/AI/小程序/developer-profile-miniapp/README.md').read_text(encoding='utf-8')
checks = ['不登录', '不采集 openid', '不采集手机号', '不上传表单内容', '不连接后端 API']
for item in checks:
    print(item, 'PASS' if item in text else 'FAIL')
PY
```

Expected: every line prints `PASS`.

---

## Task 4: Run verification

**Files:**
- Verify all project files.
- Optional build if dependencies can install.

- [ ] **Step 1: Verify required files**

Run:

```bash
python - <<'PY'
from pathlib import Path
root = Path('D:/AI/小程序/developer-profile-miniapp')
files = [
    'package.json',
    'index.html',
    'src/main.js',
    'src/App.vue',
    'src/pages.json',
    'src/manifest.json',
    'src/pages/index/index.vue',
    'README.md'
]
for file in files:
    print(file, 'PASS' if (root / file).exists() else 'FAIL')
PY
```

Expected: every line prints `PASS`.

- [ ] **Step 2: Verify no data submission logic exists**

Run:

```bash
python - <<'PY'
from pathlib import Path
root = Path('D:/AI/小程序/developer-profile-miniapp')
texts = '\n'.join(p.read_text(encoding='utf-8', errors='ignore') for p in root.rglob('*') if p.is_file() and p.suffix in {'.vue', '.js', '.json', '.md'})
blocked = ['uni.request', 'wx.request', 'wx.login', 'getPhoneNumber', 'getUserProfile', 'cloud.database', 'cloud.callFunction']
for item in blocked:
    print(item, 'FAIL' if item in texts else 'PASS')
PY
```

Expected: every line prints `PASS`.

- [ ] **Step 3: Install dependencies if network and npm are available**

Run:

```bash
npm install
```

Expected: dependency installation completes without package resolution errors. If network or registry is unavailable, record as not verified rather than claiming build success.

- [ ] **Step 4: Build H5 if dependencies installed**

Run:

```bash
npm run build:h5
```

Expected: build exits 0 and produces output under `dist/`.

- [ ] **Step 5: Build WeChat mini program if dependencies installed**

Run:

```bash
npm run build:mp-weixin
```

Expected: build exits 0 and produces output under `dist/build/mp-weixin/`.

---

## Self-Review

- Spec coverage: The plan implements a single-page developer service miniapp, includes static consultation flow, avoids login/backend/cloud/data collection, and includes privacy boundary documentation.
- Placeholder scan: No placeholder tasks remain. Contact values intentionally remain visible text placeholders because the user did not provide actual WeChat ID or phone.
- Type consistency: Vue reactive form keys are `type`, `budget`, and `description`; template references match those names.
