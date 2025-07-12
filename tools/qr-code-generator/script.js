document.addEventListener("DOMContentLoaded", () => {
  // 1. Inject global navbar
  fetch("https://hangga-hub.github.io/components/navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar").innerHTML = html;
      const toggle = document.getElementById("menuToggle");
      const links  = document.querySelector(".nav-links");
      toggle?.addEventListener("click", () => links.classList.toggle("show"));
      document.querySelectorAll(".nav-links a")
        .forEach(link => {
          if (window.location.href.includes(link.href)) {
            link.classList.add("active");
          }
        });
    });

  // 2. Initialize QR generator
  initQRGenerator();
});

function initQRGenerator() {
  const input    = document.getElementById("textInput");
  const genBtn   = document.getElementById("generateBtn");
  const dlBtn    = document.getElementById("downloadBtn");
  const qrContainer = document.getElementById("qrcode");
  let currentCanvas = null;

  genBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) {
      alert("Please enter text or URL to generate a QR code.");
      return;
    }

    qrContainer.innerHTML = "";      // clear previous
    console.log("Generating QR for:", text);

    // create a <canvas> and draw the QR code into it
    const canvas = document.createElement("canvas");
    QRCode.toCanvas(canvas, text, {
      width: 256,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" }
    }, err => {
      if (err) {
        console.error("QR generation failed:", err);
        alert("Failed to generate QR code. See console for details.");
        return;
      }
      qrContainer.appendChild(canvas);
      currentCanvas = canvas;
      console.log("QR code generated successfully");
    });
  });

  dlBtn.addEventListener("click", () => {
    if (!currentCanvas) {
      alert("Generate a QR code first!");
      return;
    }
    const dataUrl = currentCanvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}
