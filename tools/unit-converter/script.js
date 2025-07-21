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

  setupUnitOptions(); // Call this to set up initial options and listeners
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
  pressure: {
    Pa: 1,
    kPa: 1000,
    MPa: 1e6,
    bar: 1e5,
    psi: 6894.76,
    atm: 101325
  },
  data: {
    bit: 0.125,
    byte: 1,
    KiB: 1024,
    MiB: 1048576,
    GiB: 1073741824,
    TiB: 1099511627776
  },
  energy: {
    J: 1,
    kJ: 1000,
    cal: 4.184,
    kcal: 4184,
    Wh: 3600,
    kWh: 3.6e6
  },
  power: {
    W: 1,
    kW: 1000,
    MW: 1e6,
    hp: 745.7
  },
  volume: {
    'cm³': 0.000001,
    'm³': 1,
    L: 0.001,
    mL: 0.000001,
    'in³': 0.0000163871,
    'ft³': 0.0283168,
    gallon: 0.00378541
  },
  frequency: { // New category for frequency
    Hz: 1,
    kHz: 1000,
    MHz: 1000000,
    GHz: 1000000000
  },
  image_conversion: { // New category for image unit conversion (cm to pixel)
    // Conversion from cm to pixel is dependent on DPI/PPI.
    // Assuming a standard web DPI of 96 pixels per inch (1 inch = 2.54 cm).
    // 1 cm = (96 pixels / 1 inch) * (1 inch / 2.54 cm) = 37.7952755906 pixels
    cm: 1, // Base unit for internal calculation in cm
    px: 1 / 37.7952755906 // 1 pixel in cm at 96 DPI
  }
};

const categoryMap = {
  length: "📏 Length",
  weight: "⚖️ Weight",
  temperature: "🌡️ Temperature",
  time: "🕑 Time",
  speed: "🧭 Speed",
  area: "📐 Area",
  volume: "🧪 Volume",
  data: "💾 Data",
  energy: "⚡ Energy",
  pressure: "💧 Pressure",
  power: "🔋 Power",
  frequency: "📡 Frequency", // Add new category
  image_conversion: "🖼️ Image Conversion (cm/px)" // Add new category
};

function setupUnitOptions() {
  const categorySelect = document.getElementById("category");
  const fromUnitSelect = document.getElementById("fromUnit");
  const toUnitSelect = document.getElementById("toUnit");
  const inputValue = document.getElementById("inputValue");

  // Populate category options dynamically
  categorySelect.innerHTML = Object.entries(categoryMap)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");

  // Set up initial unit options based on the first category
  updateUnitOptions();

  // Add event listeners for changes that should trigger conversion
  categorySelect.addEventListener("change", () => {
    updateUnitOptions(); // Update units first
    convertUnit();      // Then convert
  });
  fromUnitSelect.addEventListener("change", convertUnit);
  toUnitSelect.addEventListener("change", convertUnit);
  inputValue.addEventListener("input", convertUnit);
}

function updateUnitOptions() {
  const selectedCategory = document.getElementById("category").value;
  const fromUnitSelect = document.getElementById("fromUnit");
  const toUnitSelect = document.getElementById("toUnit");

  // Clear existing options
  fromUnitSelect.innerHTML = "";
  toUnitSelect.innerHTML = "";

  const currentUnits = units[selectedCategory];
  if (selectedCategory === "temperature") {
    // Temperature has fixed options
    ["celsius", "fahrenheit", "kelvin"].forEach((unit) => {
      const option1 = document.createElement("option");
      option1.value = unit;
      option1.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
      fromUnitSelect.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = unit;
      option2.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
      toUnitSelect.appendChild(option2);
    });
  } else if (currentUnits) {
    // Populate unit options based on the selected category
    for (const unit in currentUnits) {
      const option1 = document.createElement("option");
      option1.value = unit;
      option1.textContent = unit;
      fromUnitSelect.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = unit;
      option2.textContent = unit;
      toUnitSelect.appendChild(option2);
    }
  }
  // Trigger a conversion after updating units, in case the selected units changed
  convertUnit();
}

function formatNumber(num) {
  // Handle cases where num is very small or very large by using exponential notation
  if (Math.abs(num) < 0.000001 && num !== 0) { // Small numbers, but not zero
    return num.toExponential(4);
  }
  if (Math.abs(num) > 1000000000) { // Large numbers
    return num.toExponential(4);
  }
  // For other numbers, use toPrecision for up to 4 significant digits and remove trailing zeros
  return parseFloat(num.toPrecision(4)).toString();
}

function convertUnit() {
  const type = document.getElementById("category").value;
  const from = document.getElementById("fromUnit").value;
  const to = document.getElementById("toUnit").value;
  const val = parseFloat(document.getElementById("inputValue").value);
  const result = document.getElementById("result");

  // Clear previous result or error messages
  result.innerHTML = '';

  if (isNaN(val)) {
    result.innerHTML = '<span class="result-error">Please enter a valid number.</span>';
    return;
  }

  // Handle cases where units might not be loaded yet (e.g., initial state)
  if (!from || !to) {
    result.innerHTML = '<span class="result-error">Please select units.</span>';
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

  // General unit conversion
  const base = val * units[type][from];
  const converted = base / units[type][to];
  let resultHtml = `<span class="result-card">🧮 <b>${formatNumber(val)}</b> ${from} = <b>${formatNumber(converted)}</b> ${to}</span>`;

  if (type === "image_conversion") {
    resultHtml += `<p style="font-size:0.8em; color:#aaa; margin-top: 0.5em;">Note: CM to Pixel conversion assumes 96 DPI. Actual pixel values may vary based on screen resolution or image DPI.</p>`;
  }

  result.innerHTML = resultHtml;
}

function convertTemperature(val, from, to) {
  let baseCelsius;

  // Convert to Celsius first
  if (from === "celsius") {
    baseCelsius = val;
  } else if (from === "fahrenheit") {
    baseCelsius = (val - 32) * 5 / 9;
  } else if (from === "kelvin") {
    baseCelsius = val - 273.15;
  } else {
    // Should not happen if dropdowns are correctly populated
    console.error("Unknown 'from' temperature unit:", from);
    return NaN;
  }

  // Convert from Celsius to target
  if (to === "celsius") {
    return baseCelsius;
  } else if (to === "fahrenheit") {
    return (baseCelsius * 9 / 5) + 32;
  } else if (to === "kelvin") {
    return baseCelsius + 273.15;
  } else {
    // Should not happen if dropdowns are correctly populated
    console.error("Unknown 'to' temperature unit:", to);
    return NaN;
  }
}
