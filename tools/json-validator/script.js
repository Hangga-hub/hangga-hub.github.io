fetch("https://hangga-hub.github.io/components/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;

    // Add collapse menu toggle
    const toggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    if (toggle && navLinks) {
      toggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }

    // Highlight active link
    document.querySelectorAll(".nav-links a").forEach(link => {
      if (window.location.href.includes(link.href)) {
        link.classList.add("active");
      }
    });
  });
// 🔧 Add custom tool logic below — e.g., JSON Validator
function validateJSON() {
  const input = document.getElementById("jsonInput").value;
  const resultBox = document.getElementById("result");

  try {
    JSON.parse(input);
    resultBox.textContent = "✅ Valid JSON!";
    resultBox.style.color = "#66bb6a";
  } catch (err) {
    resultBox.textContent = `❌ Invalid JSON: ${err.message}`;
    resultBox.style.color = "#ff6b6b";
  }
}

// You can copy/paste other tool logic here, like calculateBMI()
