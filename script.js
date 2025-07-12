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

// Theme toggle
document.getElementById("themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Mobile menu toggle
document.getElementById("menuToggle")?.addEventListener("click", () => {
  document.querySelector(".nav-links")?.classList.toggle("show");
});

// Highlight active nav link
const currentUrl = window.location.href;
document.querySelectorAll(".nav-links a").forEach(link => {
  if (currentUrl.includes(link.href)) {
    link.classList.add("active");
  }
});
