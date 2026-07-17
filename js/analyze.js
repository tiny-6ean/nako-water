export function analyzeToday(logs, settings) {
  const alertBox = document.getElementById("alertBox");
  const todayDrink = document.getElementById("todayDrink");
  const avg7 = document.getElementById("avg7");
  const ratioBox = document.getElementById("ratioBox");
  const memoList = document.getElementById("memoList");

  if (!logs.length) return;

  const latest = logs[logs.length - 1];

  todayDrink.textContent = `${latest.drink ?? "-"} g`;

  const abnormal = detectAbnormal(logs, latest);

  if (abnormal) {
    alertBox.style.display = "block";
    alertBox.textContent = abnormal;
  } else {
    alertBox.style.display = "none";
  }

  const avg = movingAverage(logs, 7);
  avg7.textContent = `${avg} g`;

  ratioBox.textContent = calcSourceRatio(logs);

  memoList.innerHTML = logs
    .slice(-10)
    .map(l => `${l.date}：${l.memo || "（なし）"}`)
    .join("<br>");
}

export function detectAbnormal(logs, latest) {
  if (!latest.drink) return null;

  const drink = latest.drink;

  const last7 = logs.slice(-7).map(l => l.drink).filter(v => v !== null);
  const avg7 = last7.length ? last7.reduce((a, b) => a + b, 0) / last7.length : null;

  const prev = logs.length > 1 ? logs[logs.length - 2].drink : null;

  if (prev !== null && Math.abs(drink - prev) >= 50) {
    return `⚠ 飲水量が前日比で大きく変化しています（${drink - prev} g）`;
  }

  if (avg7 !== null) {
    const diffRate = (drink - avg7) / avg7;

    if (Math.abs(diffRate) >= 0.4) {
      return `⚠ 飲水量が7日平均から大きく外れています（平均 ${avg7.toFixed(1)} g）`;
    }
  }

  if (prev !== null && drink < prev - 40) {
    return `⚠ 飲水量が急激に減少しています（腎臓系の異常の可能性）`;
  }

  if (prev !== null && drink > prev + 60) {
    return `⚠ 飲水量が急激に増加しています（糖尿病の可能性）`;
  }

  return null;
}

export function movingAverage(logs, days) {
  const arr = logs.slice(-days).map(l => l.drink).filter(v => v !== null);
  if (!arr.length) return "-";
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  return avg.toFixed(1);
}

export function calcSourceRatio(logs) {
  const sum = { "給水器": 0, "食器": 0 };

  logs.forEach(l => {
    if (!l.drink) return;
    if (l.source.includes("給水器")) sum["給水器"] += l.drink;
    else sum["食器"] += l.drink;
  });

  const total = sum["給水器"] + sum["食器"];
  if (total === 0) return "データなし";

  const rateA = Math.round((sum["給水器"] / total) * 100);
  const rateB = 100 - rateA;

  return `給水器 ${rateA}% / 食器 ${rateB}%`;
}

export function updateDashboard(logs, settings) {
  analyzeToday(logs, settings);
}

export function generateMonthlyReport(logs, settings) {
  const monthlyReport = document.getElementById("monthlyReport");
  if (!logs.length) {
    monthlyReport.textContent = "データがありません";
    return;
  }

  const now = new Date();
  const ym = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthLogs = logs.filter(l => l.date.startsWith(ym));

  if (!monthLogs.length) {
    monthlyReport.textContent = "今月のデータがありません";
    return;
  }

  const total = monthLogs
    .map(l => l.drink || 0)
    .reduce((a, b) => a + b, 0);

  const avg = (total / monthLogs.length).toFixed(1);

  const abnormalDays = monthLogs
    .map(l => {
      const abnormal = detectAbnormal(logs, l);
      return abnormal ? `${l.date}：${abnormal}` : null;
    })
    .filter(v => v !== null);

  const sourceSum = {};
  settings.sources.forEach(s => (sourceSum[s.name] = 0));

  monthLogs.forEach(l => {
    if (l.drink && sourceSum[l.source] !== undefined) {
      sourceSum[l.source] += l.drink;
    }
  });

  const sourceRatio = Object.entries(sourceSum)
    .map(([name, val]) => `${name}: ${val}g`)
    .join("<br>");

  const maxDay = monthLogs.reduce((a, b) => (a.drink > b.drink ? a : b));
  const minDay = monthLogs.reduce((a, b) => (a.drink < b.drink ? a : b));

  monthlyReport.innerHTML = `
    <div class="analysis-item">
      <h3>今月の総飲水量</h3>
      <div>${total} g</div>
    </div>

    <div class="analysis-item">
      <h3>1日平均</h3>
      <div>${avg} g</div>
    </div>

    <div class="analysis-item">
      <h3>最多飲水日</h3>
      <div>${maxDay.date}：${maxDay.drink} g</div>
    </div>

    <div class="analysis-item">
      <h3>最少飲水日</h3>
      <div>${minDay.date}：${minDay.drink} g</div>
    </div>

    <div class="analysis-item">
      <h3>飲水源ごとの合計</h3>
      <div>${sourceRatio}</div>
    </div>

    <div class="analysis-item">
      <h3>異常日の一覧</h3>
      <div>${abnormalDays.length ? abnormalDays.join("<br>") : "異常なし"}</div>
    </div>
  `;
}
