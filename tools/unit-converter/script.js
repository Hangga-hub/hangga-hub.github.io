// Inject shared navbar
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://hangga-hub.github.io/components/navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar").innerHTML = html;

      document.getElementById("menuToggle")?.addEventListener("click", () => {
        document.querySelector(".nav-links")?.classList.toggle("show");
      });

      document.querySelectorAll(".nav-links a").forEach(link => {
        if (window.location.href.includes(link.href)) {
          link.classList.add("active");
        }
      });
    });

  setupUnitOptions();
});

// 🧠 Converter Engine
const units = {
  length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34
  },
  weight: {
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    oz: 0.0283495,
    lb: 0.453592,
    ton: 1000
  },
  speed: {
    'm/s': 1,
    'km/h': 0.277778,
    mph: 0.44704,
    knots: 0.514444
  },
  time: {
    sec: 1,
    min: 60,
    hr: 3600,
    day: 86400
  },
  area: {
    'cm²': 0.0001,
    'm²': 1,
    'km²': 1e6,
    'in²': 0.00064516,
    'ft²': 0.092903,
    acre: 4046.86,
    ha: 10000
  },
  volume: {
    ml: 0.001,
    l: 1,
    'm³': 1000,
    'in³': 0.0163871,
    'ft³': 28.3168,
    gallon: 3.78541
  },
  temperature: {} // handled separately
};

function setupUnitOptions() {
  const category = document.getElementById("category");
  category.addEventListener("change", updateUnits);
  updateUnits(); // Initial

  // Add event listeners for conversion
  document.getElementById("convertBtn")?.addEventListener("click", convertUnit);
  document.getElementById("inputValue")?.addEventListener("input", convertUnit);
  document.getElementById("fromUnit")?.addEventListener("change", convertUnit);
  document.getElementById("toUnit")?.addEventListener("change", convertUnit);
}

function updateUnits() {
  const type = document.getElementById("category").value;
  document.body.setAttribute("data-category", type);

  const from = document.getElementById("fromUnit");
  const to = document.getElementById("toUnit");

  from.innerHTML = '';
  to.innerHTML = '';

  if (type === "temperature") {
    const tempUnits = ["C", "F", "K"];
    tempUnits.forEach(u => {
      from.innerHTML += `<option value="${u}">${u}</option>`;
      to.innerHTML += `<option value="${u}">${u}</option>`;
    });
  } else {
    Object.keys(units[type]).forEach(u => {
      from.innerHTML += `<option value="${u}">${u}</option>`;
      to.innerHTML += `<option value="${u}">${u}</option>`;
    });
  }
}

function formatNumber(num) {
  // Show up to 4 significant digits, no trailing zeros
  if (num === 0) return "0";
  // Use Intl.NumberFormat for up to 4 significant digits, no trailing zeros
  return Number.parseFloat(num.toPrecision(4)).toString();
}

function convertUnit() {
  const type = document.getElementById("category").value;
  const from = document.getElementById("fromUnit").value;
  const to = document.getElementById("toUnit").value;
  const val = parseFloat(document.getElementById("inputValue").value);
  const result = document.getElementById("result");

  if (isNaN(val)) {
    result.innerHTML = '<span class="result-error">Please enter a valid number.</span>';
    return;
  }

  if (type === "temperature") {
    if (from === to) {
      result.innerHTML = `<span class="result-temp">🌡️ <b>${formatNumber(val)}</b> ${from} = <b>${formatNumber(val)}</b> ${to}</span>`;
      return;
    }
    const converted = convertTemperature(val, from, to);
    result.innerHTML = `<span class="result-temp">🌡️ <b>${formatNumber(val)}</b> ${from} = <b>${formatNumber(converted)}</b> ${to}</span>`;
    return;
  }

  const base = val * units[type][from];
  const converted = base / units[type][to];
  result.innerHTML = `<span class="result-card">🧮 <b>${formatNumber(val)}</b> ${from} = <b>${formatNumber(converted)}</b> ${to}</span>`;
}

function convertTemperature(val, from, to) {
  let celsius;
  if (from === "C") celsius = val;
  else if (from === "F") celsius = (val - 32) * 5 / 9;
  else if (from === "K") celsius = val - 273.15;

  if (to === "C") return celsius;
  if (to === "F") return celsius * 9 / 5 + 32;
  if (to === "K") return celsius + 273.15;
}
