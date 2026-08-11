<script setup>
import { reactive } from 'vue'

const projectTypes = ['门店管理', '电商商品', '预约服务', '内容展示', '设备管理', '企业管理']
const budgetRanges = ['待沟通', '基础版', '标准版', '定制版']

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
  type: projectTypes[0],
  budget: budgetRanges[0],
  description: ''
})

function updateProjectType(event) {
  form.type = projectTypes[event.detail.value]
}

function updateBudget(event) {
  form.budget = budgetRanges[event.detail.value]
}

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
  <view class="page">
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
        <picker :range="projectTypes" @change="updateProjectType">
          <view class="picker-value">{{ form.type }}</view>
        </picker>
      </view>
      <view class="form-block">
        <text class="label">预算范围</text>
        <picker :range="budgetRanges" @change="updateBudget">
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
  </view>
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
