// script.js - Simplified navbar interactions

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");

    if (!navbarContainer) {
        console.error("Error: Navbar container (#navbar) not found.");
        return;
    }

    // Determine base path for assets
    let basePath = window.location.pathname;
    const htmlFileMatch = basePath.match(/\/[^/]+\.html$/);
    if (htmlFileMatch) {
        basePath = basePath.substring(0, basePath.lastIndexOf('/'));
    }
    if (basePath.includes('/tools/')) {
        basePath = basePath.substring(0, basePath.indexOf('/tools/'));
    }
    if (basePath === '') {
        basePath = '/';
    } else if (!basePath.startsWith('/')) {
        basePath = '/' + basePath;
    }
    if (basePath.endsWith('/') && basePath.length > 1) {
        basePath = basePath.slice(0, -1);
    }

    const navbarPath = window.location.origin + basePath + "/components/navbar.html";
    console.log("Fetching navbar from:", navbarPath);

    // Initialize navbar interactions
    const initializeNavbarInteractions = () => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");
        const dropdowns = document.querySelectorAll(".dropdown");
        const dropbtns = document.querySelectorAll(".dropdown .dropbtn");

        // Mobile menu toggle
        if (menuToggle && navLinks) {
            menuToggle.addEventListener("click", (e) => {
                e.stopPropagation();
                navLinks.classList.toggle("show");
                const isExpanded = navLinks.classList.contains("show");
                menuToggle.setAttribute("aria-expanded", isExpanded);
                
                // Close all dropdowns when toggling main menu
                dropdowns.forEach(dropdown => dropdown.classList.remove("open"));
            });
        }

        // Dropdown toggle for mobile
        dropbtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const parentDropdown = btn.closest(".dropdown");
                if (!parentDropdown) return;

                // On mobile, toggle the dropdown
                if (window.innerWidth <= 768) {
                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== parentDropdown) {
                            otherDropdown.classList.remove("open");
                        }
                    });
                    // Toggle current dropdown
                    parentDropdown.classList.toggle("open");
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            const navbarNav = document.querySelector('nav.sticky');
            const isClickInsideNav = navbarNav && navbarNav.contains(e.target);

            if (!isClickInsideNav) {
                if (navLinks && navLinks.classList.contains("show")) {
                    navLinks.classList.remove("show");
                    menuToggle.setAttribute("aria-expanded", "false");
                }
                dropdowns.forEach(dropdown => dropdown.classList.remove("open"));
            }
        });

        // Handle window resize
        const handleResize = () => {
            if (window.innerWidth > 768) {
                // Desktop view - close mobile menu and dropdowns
                if (navLinks) navLinks.classList.remove("show");
                if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
                dropdowns.forEach(dropdown => dropdown.classList.remove("open"));
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Highlight active nav link
        highlightActiveNavLink();
    };

    // Highlight active nav link
    const highlightActiveNavLink = () => {
        const currentPathname = window.location.pathname;
        const allLinks = document.querySelectorAll("nav.sticky a");

        allLinks.forEach(link => {
            link.classList.remove("active");
            let linkHref = new URL(link.href).pathname;

            if (linkHref === '/' || linkHref === '/index.html') {
                if (currentPathname === '/' || currentPathname === '/index.html') {
                    link.classList.add("active");
                }
            } else if (linkHref === '/index2.html') {
                if (currentPathname === '/index2.html') {
                    link.classList.add("active");
                }
            } else if (currentPathname.startsWith(linkHref) && linkHref !== '/') {
                link.classList.add("active");
            }

            // Highlight dropdown button if child link is active
            if (link.classList.contains("active")) {
                const parentDropdown = link.closest(".dropdown");
                if (parentDropdown) {
                    const dropbtn = parentDropdown.querySelector(".dropbtn");
                    if (dropbtn) dropbtn.classList.add("active");
                }
            }
        });
    };

    // Fetch and inject navbar
    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            navbarContainer.innerHTML = html;
            initializeNavbarInteractions();
        })
        .catch(error => {
            console.error("Failed to load navbar:", error);
            navbarContainer.innerHTML = "<nav class='error-nav'><p>Navigation temporarily unavailable</p></nav>";
        });
});