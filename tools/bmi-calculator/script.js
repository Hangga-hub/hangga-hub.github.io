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

// BMI calculation
function calculateBMI() {
  const unit = document.getElementById("unitToggle").value;
  let weight, height;
  if (unit === "metric") {
    weight = parseFloat(document.getElementById("weight").value);
    height = parseFloat(document.getElementById("height").value) / 100;
  } else {
    weight = parseFloat(document.getElementById("weightLb").value) * 0.453592;
    height = parseFloat(document.getElementById("heightIn").value) * 0.0254;
  }
  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value);
  const result = document.getElementById("result");

  if (!weight || !height || !age || age < 1) {
    result.innerHTML = '<span class="neon-error">Please enter valid numbers!</span>';
    return;
  }

  const bmi = (weight / (height * height));
  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 24.9) category = "Normal weight";
  else if (bmi < 29.9) category = "Overweight";
  else category = "Obese";

  result.innerHTML = `<span>Gender: <b>${gender.charAt(0).toUpperCase() + gender.slice(1)}</b> | Age: <b>${age}</b><br>Your BMI is <b>${bmi.toFixed(2)}</b> (${category})</span>`;
}

// Toggle metric/imperial fields
const unitToggle = document.getElementById("unitToggle");
if (unitToggle) {
  unitToggle.addEventListener("change", function() {
    if (this.value === "metric") {
      document.getElementById("metricFields").style.display = "block";
      document.getElementById("imperialFields").style.display = "none";
    } else {
      document.getElementById("metricFields").style.display = "none";
      document.getElementById("imperialFields").style.display = "block";
    }
  });
}

