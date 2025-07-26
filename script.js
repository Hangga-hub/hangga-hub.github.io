// script.js - Universal navbar loader with responsive interactions

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) {
        console.error("Navbar container not found.");
        return;
    }

    // Normalize and detect base path
    let basePath = window.location.pathname;
    const htmlMatch = basePath.match(/\/[^/]+\.html$/);
    if (htmlMatch) {
        basePath = basePath.substring(0, basePath.lastIndexOf('/'));
    }
    if (basePath.includes('/tools/')) {
        basePath = basePath.substring(0, basePath.indexOf('/tools/'));
    }
    if (!basePath.startsWith('/')) basePath = '/' + basePath;
    if (!basePath.endsWith('/')) basePath += '/';

    const fullPath = `${window.location.origin}${basePath}components/navbar.html`;
    console.log("Attempting navbar fetch from:", fullPath);

    const loadNavbar = (path) =>
        fetch(path)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            });

    const initializeNavbarInteractions = () => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");
        const dropdowns = document.querySelectorAll(".dropdown");
        const dropbtns = document.querySelectorAll(".dropdown .dropbtn");

        // Mobile toggle
        if (menuToggle && navLinks) {
            menuToggle.addEventListener("click", (e) => {
                e.stopPropagation();
                navLinks.classList.toggle("show");
                menuToggle.setAttribute("aria-expanded", navLinks.classList.contains("show"));
                dropdowns.forEach(d => d.classList.remove("open"));
            });
        }

        // Dropdown toggle
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

        // Close on outside click
        document.addEventListener("click", (e) => {
            const nav = document.querySelector("nav.sticky");
            if (!nav?.contains(e.target)) {
                navLinks?.classList.remove("show");
                menuToggle?.setAttribute("aria-expanded", false);
                dropdowns.forEach(d => d.classList.remove("open"));
            }
        });

        // Resize resets
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
        const path = window.location.pathname;
        document.querySelectorAll("nav.sticky a").forEach(link => {
            link.classList.remove("active");
            const href = new URL(link.href).pathname;
            const isExactMatch = path === href;
            const isRootMatch = (href === '/' || href === '/index.html') && (path === '/' || path === '/index.html');
            const isDeepMatch = href !== '/' && path.startsWith(href);

            if (isExactMatch || isRootMatch || isDeepMatch) {
                link.classList.add("active");
                const dropdown = link.closest(".dropdown");
                dropdown?.querySelector(".dropbtn")?.classList.add("active");
            }
        });
    };

    loadNavbar(fullPath)
        .catch(() => {
            console.warn("Fallback attempt to root");
            return loadNavbar(`${window.location.origin}/components/navbar.html`);
        })
        .then(html => {
            navbarContainer.innerHTML = html;
            initializeNavbarInteractions();
        })
        .catch(error => {
            console.error("Navbar load error:", error);
            navbarContainer.innerHTML = "<nav class='error-nav'><p>Navigation unavailable</p></nav>";
        });
});
