/**
 * AI 概率分析
 */
export function mockAIDataByTime(startTime, endTime) {
  const startHour = Number(startTime.split(':')[0])
  const endHour = Number(endTime.split(':')[0])

  const count = (endHour - startHour) * 6

  return Array.from({ length: count }).map((_, i) => ({
    time: `${startHour + Math.floor(i / 6)}:${(i % 6) * 10}`,
    value: Math.round(
      30 + Math.random() * 40 + startHour
    )
  }))
}

/**
 * 激光厚度（三条线）
 */
export function mockLaserThickness(startTime, endTime) {
  const startHour = Number(startTime.split(':')[0])
  const endHour = Number(endTime.split(':')[0])
  const count = (endHour - startHour) * 6

  const gen = (base) =>
    Array.from({ length: count }).map(() =>
      Number((base + Math.random() * 0.4).toFixed(2))
    )

  return {
    times: Array.from({ length: count }).map((_, i) =>
      `${startHour + Math.floor(i / 6)}:${(i % 6) * 10}`
    ),
    line1: gen(1.5),
    line2: gen(1.8),
    line3: gen(2.0)
  }
}
