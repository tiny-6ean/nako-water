export function initChart(settings) {
  const graphCat = document.getElementById("graphCat");
  const graphSource = document.getElementById("graphSource");
  const graphRange = document.getElementById("graphRange");

  const cats = JSON.parse(localStorage.getItem("cats") || "[]");
  cats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.name;
    opt.textContent = cat.name;
    graphCat.appendChild(opt);
  });

  settings.sources.forEach(src => {
    const opt = document.createElement("option");
    opt.value = src.name;
    opt.textContent = src.name;
    graphSource.appendChild(opt);
  });

  graphCat.addEventListener("change", drawChart);
  graphSource.addEventListener("change", drawChart);
  graphRange.addEventListener("change", drawChart);

  drawChart();
}

export function drawChart() {
  const canvas = document.getElementById("drinkChart");
  const ctx = canvas.getContext("2d");

  const logs = JSON.parse(localStorage.getItem("water_log") || "[]");

  const cat = document.getElementById("graphCat").value;
  const source = document.getElementById("graphSource").value;
  const range = Number(document.getElementById("graphRange").value);

  const filtered = logs.filter(l => l.cat === cat && l.source === source);
  const data = filtered.slice(-range);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!data.length) return;

  const drinks = data.map(d => d.drink ?? 0);
  const min = Math.min(...drinks);
  const max = Math.max(...drinks);
  const diff = max - min || 1;

  const w = canvas.width;
  const h = canvas.height;

  ctx.strokeStyle = "#ccc";
  ctx.beginPath();
  ctx.moveTo(0, h - 20);
  ctx.lineTo(w, h - 20);
  ctx.stroke();

  ctx.strokeStyle = "#4a90e2";
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((d, i) => {
    const x = (w - 20) * (i / Math.max(data.length - 1, 1)) + 10;
    const y = h - 20 - ((d.drink - min) / diff) * (h - 40);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  const avg = drinks.reduce((a, b) => a + b, 0) / drinks.length;

  ctx.strokeStyle = "#7fb3ff";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();

  const avgY = h - 20 - ((avg - min) / diff) * (h - 40);
  ctx.moveTo(10, avgY);
  ctx.lineTo(w - 10, avgY);
  ctx.stroke();
  ctx.setLineDash([]);
}
