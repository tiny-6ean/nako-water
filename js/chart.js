export function initChart(settings) {
  const graphCat = document.getElementById("graphCat");
  const graphSource = document.getElementById("graphSource");
  const graphRange = document.getElementById("graphRange");

  // ★猫は localStorage から読む
  const cats = JSON.parse(localStorage.getItem("cats") || "[]");
  cats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.name;
    opt.textContent = cat.name;
    graphCat.appendChild(opt);
  });

  // ★飲水源は settings.json から読む
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
