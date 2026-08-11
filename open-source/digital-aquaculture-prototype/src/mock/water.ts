export function getWaterQuality() {
  return {
    pH: +(6.8 + Math.random()).toFixed(2),
    do: +(6 + Math.random() * 2).toFixed(2),
    turbidity: +(3 + Math.random() * 5).toFixed(2),
    ammonia: +(Math.random() * 0.5).toFixed(2),
    temperature: +(24 + Math.random() * 4).toFixed(1),
    time: new Date().toLocaleTimeString()
  }
}
