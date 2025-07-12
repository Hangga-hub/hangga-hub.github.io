document.addEventListener("DOMContentLoaded", () => {
  // Inject global navbar
  fetch("https://hangga-hub.github.io/components/navbar.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("navbar").innerHTML = html;
      const toggle = document.getElementById("menuToggle");
      const links  = document.querySelector(".nav-links");
      toggle?.addEventListener("click", () => links.classList.toggle("show"));
      document.querySelectorAll(".nav-links a").forEach(a => {
        if (window.location.href.includes(a.href)) a.classList.add("active");
      });
    })
    .catch(err => console.error("Navbar load failed:", err));

  initConverter();
});

function initConverter() {
  const inputEl   = document.getElementById("inputData");
  const outputEl  = document.getElementById("outputData");
  const errorEl   = document.getElementById("errorMessage");
  const toJsonBtn = document.getElementById("toJsonBtn");
  const toCsvBtn  = document.getElementById("toCsvBtn");
  const clearBtn  = document.getElementById("clearBtn");

  toJsonBtn.addEventListener("click", () => {
    errorEl.textContent = "";
    try {
      const csv   = inputEl.value.replace(/^\uFEFF/, "");
      const arr   = parseCSV(csv);
      outputEl.value = JSON.stringify(arr, null, 2);
    } catch (err) {
      console.error("CSV→JSON error:", err);
      errorEl.textContent = "Invalid CSV format.";
    }
  });

  toCsvBtn.addEventListener("click", () => {
    errorEl.textContent = "";
    let raw = inputEl.value.replace(/^\uFEFF/, "");
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("JSON parse error:", err);
      errorEl.textContent = "Invalid JSON.";
      return;
    }

    // If top‐level object has a single array property, use that array
    let arr;
    if (Array.isArray(data)) {
      arr = data;
    } else if (
      typeof data === "object" &&
      Object.keys(data).length === 1 &&
      Array.isArray(data[Object.keys(data)[0]])
    ) {
      arr = data[Object.keys(data)[0]];
    } else {
      errorEl.textContent = "JSON must be an array or an object whose only property is an array.";
      return;
    }

    try {
      const csv = jsonToCSV(arr);
      outputEl.value = csv;
    } catch (err) {
      console.error("JSON→CSV error:", err);
      errorEl.textContent = "Failed to convert JSON.";
    }
  });

  clearBtn.addEventListener("click", () => {
    inputEl.value = "";
    outputEl.value = "";
    errorEl.textContent = "";
  });
}

// CSV → array of objects
function parseCSV(text) {
  if (!text) return [];
  const lines   = text.split(/\r?\n/).filter(l => l.trim());
  const headers = parseLine(lines.shift());
  return lines.map(line => {
    const values = parseLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? "";
    });
    return obj;
  });
}

// Split CSV line into fields (handles quoted commas)
function parseLine(line) {
  const result   = [];
  let current    = "";
  let inQuotes   = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && line[i + 1] === '"') {
      current += '"';
      i++;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// array of objects → CSV string
function jsonToCSV(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "";

  // Collect all headers in order of appearance
  const headers = arr.reduce((set, obj) => {
    Object.keys(obj).forEach(k => set.add(k));
    return set;
  }, new Set());

  const headerRow = Array.from(headers);
  const lines     = [headerRow.join(",")];

  arr.forEach(obj => {
    const row = headerRow.map(key => {
      let cell = obj[key] == null ? "" : String(obj[key]);
      if (/[",\r\n]/.test(cell)) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });
    lines.push(row.join(","));
  });

  return lines.join("\r\n");
}
