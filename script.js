document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) {
        console.error("Navbar container not found.");
        return;
    }

    // Dynamically resolve path to navbar.html based on current location
    const currentDir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    const navbarPath = `${currentDir}components/navbar.html`;

    console.log("Fetching navbar from:", navbarPath);

    fetch(navbarPath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            navbarContainer.innerHTML = html;
            initializeNavbarInteractions();
        })
        .catch(error => {
            console.error("Navbar load failed:", error);
            navbarContainer.innerHTML = "<nav class='error-nav'><p>Navigation unavailable</p></nav>";
        });

    // Your existing interaction logic stays the same
    const initializeNavbarInteractions = () => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");
        const dropdowns = document.querySelectorAll(".dropdown");
        const dropbtns = document.querySelectorAll(".dropdown .dropbtn");

        if (menuToggle && navLinks) {
            menuToggle.addEventListener("click", (e) => {
                e.stopPropagation();
                navLinks.classList.toggle("show");
                menuToggle.setAttribute("aria-expanded", navLinks.classList.contains("show"));
                dropdowns.forEach(d => d.classList.remove("open"));
            });
        }

        dropbtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const parent = btn.closest(".dropdown");
                if (window.innerWidth <= 768 && parent) {
                    dropdowns.forEach(d => d !== parent && d.classList.remove("open"));
                    parent.classList.toggle("open");
                }
            });
        });

        document.addEventListener("click", (e) => {
            const nav = document.querySelector("nav.sticky");
            if (!nav?.contains(e.target)) {
                navLinks?.classList.remove("show");
                menuToggle?.setAttribute("aria-expanded", false);
                dropdowns.forEach(d => d.classList.remove("open"));
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                navLinks?.classList.remove("show");
                menuToggle?.setAttribute("aria-expanded", false);
                dropdowns.forEach(d => d.classList.remove("open"));
            }
        });

        highlightActiveNavLink();
    };

    const highlightActiveNavLink = () => {
        const currentPath = window.location.pathname;
        document.querySelectorAll("nav.sticky a").forEach(link => {
            link.classList.remove("active");
            const hrefPath = new URL(link.href).pathname;

            const matchRoot = hrefPath === "/" || hrefPath === "/index.html";
            const matchIndex2 = hrefPath.includes("/index2.html") && currentPath === "/index2.html";
            const matchSubpath = currentPath.startsWith(hrefPath) && hrefPath !== "/";

            if (
                (matchRoot && (currentPath === "/" || currentPath === "/index.html")) ||
                matchIndex2 ||
                matchSubpath
            ) {
                link.classList.add("active");
                link.closest(".dropdown")?.querySelector(".dropbtn")?.classList.add("active");
            }
        });
    };
});
