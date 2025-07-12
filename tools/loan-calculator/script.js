document.addEventListener("DOMContentLoaded", () => {
  // Inject shared navbar
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

  initLoanCalculator();
});

function initLoanCalculator() {
  const loanAmount   = document.getElementById("loanAmount");
  const interestRate = document.getElementById("interestRate");
  const loanTerm     = document.getElementById("loanTerm");
  const calculateBtn = document.getElementById("calculateBtn");
  const resetBtn     = document.getElementById("resetBtn");

  calculateBtn.addEventListener("click", calculateLoan);
  resetBtn.addEventListener("click", () => {
    loanAmount.value = interestRate.value = loanTerm.value = "";
    displayResults(0, 0, 0);
  });

  // initialize
  displayResults(0, 0, 0);
}

function calculateLoan() {
  const P = parseFloat(document.getElementById("loanAmount").value);
  const r = parseFloat(document.getElementById("interestRate").value) / 100 / 12;
  const n = parseFloat(document.getElementById("loanTerm").value) * 12;
  if (!P || !r || !n) {
    alert("Please fill in all fields with valid numbers.");
    return;
  }

  const monthlyPayment = (P * r) / (1 - Math.pow(1 + r, -n));
  const totalPayment   = monthlyPayment * n;
  const totalInterest  = totalPayment - P;

  displayResults(monthlyPayment, totalPayment, totalInterest);
}

function displayResults(monthly, total, interest) {
  document.getElementById("monthlyPayment").textContent =
    `Monthly Payment: $${monthly.toFixed(2)}`;
  document.getElementById("totalPayment").textContent =
    `Total Payment: $${total.toFixed(2)}`;
  document.getElementById("totalInterest").textContent =
    `Total Interest: $${interest.toFixed(2)}`;
}
