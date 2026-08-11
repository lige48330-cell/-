<template>
  <div class="page">
    <!-- 时间查询区 -->
    <el-card class="card">
      <el-form :inline="true" :model="query">
        <el-form-item label="日期">
          <el-date-picker v-model="query.date" type="date" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker v-model="query.startTime" format="HH:mm" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker v-model="query.endTime" format="HH:mm" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refreshAll">时间查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 设备时间轴 -->
    <el-card class="card">
      <DeviceTimeline
        :devices="devices"
        :range="timeRange"
        @hover="onHover"
        @select="onSelect"
      />
    </el-card>

    <!-- 视频帧时间轴 -->
    <el-card class="card">
      <VideoTimeline
        :frames="frames"
        :hover-time="hoverTime"
        @hover="onHover"
      />
    </el-card>

    <!-- AI 概率分析 -->
    <el-card class="card">
      <LineChart :data="aiData" :hover-time="hoverTime" />
    </el-card>

    <!-- 激光厚度分析 -->
    <el-card class="card">
      <MultiLineChart :data="laserData" :hover-time="hoverTime" />
    </el-card>

    <!-- 分页 -->
    <div class="pager">
      <el-pagination
        layout="prev, pager, next"
        :current-page="page"
        :total="50"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import * as echarts from 'echarts'

/* ---------------- mock helpers ---------------- */
const genTimes = () => ['08:00','09:00','10:00','11:00','12:00']
const genDevices = () => [
  { id: 'A100', name: '设备A', start: '08:00', end: '10:30', color: '#5B8FF9' },
  { id: 'B200', name: '设备B', start: '09:00', end: '12:00', color: '#5AD8A6' }
]
const genFrames = () => genTimes().map(t => ({ time: t, img: 'https://via.placeholder.com/120x80' }))
const genAI = () => genTimes().map(() => Math.round(Math.random() * 100))
const genLaser = () => [
  { name: '通道1', data: genTimes().map(() => Math.random()*40) },
  { name: '通道2', data: genTimes().map(() => Math.random()*40) },
  { name: '通道3', data: genTimes().map(() => Math.random()*40) }
]

/* ---------------- state ---------------- */
const query = ref({ date: '', startTime: '', endTime: '' })
const page = ref(1)
const hoverTime = ref(null)

const devices = ref([])
const frames = ref([])
const aiData = ref([])
const laserData = ref([])

const timeRange = computed(() => ({ start: '08:00', end: '12:00' }))

function refreshAll() {
  devices.value = genDevices()
  frames.value = genFrames()
  aiData.value = genAI()
  laserData.value = genLaser()
}

function changePage(p) {
  page.value = p
  refreshAll()
}

function onHover(time) {
  hoverTime.value = time
}

function onSelect(payload) {
  console.log('selected', payload)
}

onMounted(refreshAll)

/* ---------------- components ---------------- */
const DeviceTimeline = {
  props: ['devices', 'range'],
  emits: ['hover', 'select'],
  template: `
    <div class="timeline">
      <div v-for="d in devices" :key="d.id" class="row">
        <span class="label">{{d.name}}</span>
        <div class="bar"
          :style="{ left: '20%', width: '50%', background: d.color }"
          @mouseenter="$emit('hover', d.start)"
          @click="$emit('select', d)"
        ></div>
      </div>
    </div>
  `
}

const VideoTimeline = {
  props: ['frames', 'hoverTime'],
  emits: ['hover'],
  template: `
    <div class="frames">
      <div v-for="f in frames" :key="f.time" class="frame"
        @mouseenter="$emit('hover', f.time)">
        <img :src="f.img" />
        <div class="time">{{f.time}}</div>
      </div>
    </div>
  `
}

const LineChart = {
  props: ['data', 'hoverTime'],
  mounted() {
    this.chart = echarts.init(this.$el)
    this.render()
  },
  watch: {
    data() { this.render() },
    hoverTime() {
      if (this.hoverTime) {
        this.chart.dispatchAction({ type: 'showTip', name: this.hoverTime })
      }
    }
  },
  methods: {
    render() {
      this.chart.setOption({
        xAxis: { type: 'category', data: genTimes() },
        yAxis: { max: 100 },
        series: [{ type: 'line', data: this.data }]
      })
    }
  },
  template: `<div class="chart"></div>`
}

const MultiLineChart = {
  props: ['data', 'hoverTime'],
  mounted() {
    this.chart = echarts.init(this.$el)
    this.render()
  },
  watch: { data() { this.render() } },
  methods: {
    render() {
      this.chart.setOption({
        legend: {},
        xAxis: { type: 'category', data: genTimes() },
        yAxis: { name: 'mm' },
        series: this.data.map(s => ({ type: 'line', name: s.name, data: s.data }))
      })
    }
  },
  template: `<div class="chart"></div>`
}
</script>

<style scoped>
.page { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.card { width: 100%; }
.timeline { display: flex; flex-direction: column; gap: 8px; }
.row { position: relative; height: 32px; background: #f5f5f5; }
.label { position: absolute; left: 0; width: 60px; }
.bar { position: absolute; height: 100%; cursor: pointer; }
.frames { display: flex; overflow-x: auto; gap: 8px; }
.frame { text-align: center; }
.chart { width: 100%; height: 260px; }
.pager { display: flex; justify-content: center; }
</style>
