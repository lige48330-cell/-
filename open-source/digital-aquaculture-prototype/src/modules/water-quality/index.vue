<template>
  <div class="water-page">

    <!-- 上半区 -->
    <div class="main-area">
      <!-- A：参数总览 -->
      <div class="panel param-overview">
        <StatGrid />
      </div>

      <!-- B：趋势曲线 -->
      <div class="panel trend-area">
        <TrendChart />
      </div>
    </div>

    <!-- C：底部区 -->
    <div class="bottom-area">
      <AlarmBar />
      <SampleTable />
    </div>

  </div>
</template>
<style scoped>
.water-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 上半区：左右 */
.main-area {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1.5fr;
  gap: 16px;
}

/* 统一卡片风格 */
.panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
}

/* 底部区 */
.bottom-area {
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

}
</style>
