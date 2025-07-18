// script.js

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");

    if (!navbarContainer) {
        console.error("Error: Navbar container (#navbar) not found. Cannot load navigation.");
        return;
    }

    // Determine the base path for assets, robustly handling GitHub Pages subdirectories.
    // This logic aims to get the "root" of your project (e.g., "/your-repo-name/")
    let basePath = window.location.pathname;
    // If the current path ends with /index.html or a tool's index.html, remove it
    if (basePath.endsWith('/index.html')) {
        basePath = basePath.substring(0, basePath.lastIndexOf('/'));
    }
    // If it's a tool sub-page (e.g., /tools/bmi-calculator), go up one more level
    // to get to the project root (e.g., /your-repo-name)
    if (basePath.includes('/tools/')) {
        // Find the index of '/tools/' and take everything before it
        basePath = basePath.substring(0, basePath.indexOf('/tools/'));
    }
    // Ensure basePath starts with a slash and ends without one (unless it's just '/')
    if (basePath === '') {
        basePath = '/';
    } else if (!basePath.startsWith('/')) {
        basePath = '/' + basePath;
    }
    if (basePath.endsWith('/') && basePath.length > 1) {
        basePath = basePath.slice(0, -1);
    }

    // Construct the absolute URL to navbar.html
    // This should now correctly form: https://your-username.github.io/your-repo-name/components/navbar.html
    const navbarPath = window.location.origin + basePath + "/components/navbar.html";

    console.log("Attempting to fetch navbar from:", navbarPath); // Crucial for debugging!

    // --- Function to initialize all navbar interactions ---
    const initializeNavbarInteractions = () => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");
        const dropdowns = document.querySelectorAll(".dropdown");
        const dropbtns = document.querySelectorAll(".dropdown .dropbtn");

        // 1. Mobile Menu Toggle (Hamburger Icon)
        if (menuToggle && navLinks) {
            menuToggle.removeEventListener("click", toggleMobileMenu); // Prevent duplicate listeners
            menuToggle.addEventListener("click", toggleMobileMenu);
        }

        function toggleMobileMenu() {
            if (navLinks) {
                navLinks.classList.toggle("show");
            }
            // Close all dropdowns when toggling the main menu
            dropdowns.forEach(openDropdown => {
                openDropdown.classList.remove("open");
            });
        }

        // 2. Dropdown Toggle for Mobile (and Desktop hover fallback)
        dropbtns.forEach(btn => {
            btn.removeEventListener("click", handleDropdownToggle); // Prevent duplicate listeners
            btn.removeEventListener("touchstart", handleDropdownToggle); // For touch devices

            btn.addEventListener("click", handleDropdownToggle);
            btn.addEventListener("touchstart", handleDropdownToggle);
        });

        function handleDropdownToggle(event) {
            const currentIsMobile = window.innerWidth <= 768;

            if (currentIsMobile) {
                event.preventDefault();
                event.stopPropagation();

                const parentDropdown = this.closest(".dropdown");

                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== parentDropdown && otherDropdown.classList.contains("open")) {
                        otherDropdown.classList.remove("open");
                    }
                });

                if (parentDropdown) {
                    parentDropdown.classList.toggle("open");
                }
            }
        }

        // 3. Desktop: show dropdown on hover (JS fallback/reinforcement)
        if (window.innerWidth > 768) {
            dropdowns.forEach(dropdown => {
                dropdown.removeEventListener('mouseenter', handleMouseEnter); // Prevent duplicate listeners
                dropdown.removeEventListener('mouseleave', handleMouseLeave); // Prevent duplicate listeners

                dropdown.addEventListener('mouseenter', handleMouseEnter);
                dropdown.addEventListener('mouseleave', handleMouseLeave);
            });
        }

        function handleMouseEnter() {
            this.classList.add('open');
        }

        function handleMouseLeave(event) {
            const dropdownContent = this.querySelector('.dropdown-content');
            if (dropdownContent && !dropdownContent.contains(event.relatedTarget)) {
                this.classList.remove('open');
            } else if (!dropdownContent) {
                this.classList.remove('open');
            }
        }

        // 4. Close mobile menu and dropdowns when clicking outside
        document.removeEventListener("click", handleOutsideClick); // Ensure only one listener
        document.addEventListener("click", handleOutsideClick);

        function handleOutsideClick(event) {
            const navbarNav = document.querySelector('nav.sticky'); // Get reference to the actual nav element
            const isClickInsideNav = navbarNav && navbarNav.contains(event.target);

            if (!isClickInsideNav) {
                if (navLinks && navLinks.classList.contains("show")) {
                    navLinks.classList.remove("show");
                }
                dropdowns.forEach(openDropdown => {
                    openDropdown.classList.remove("open");
                });
            }
        }

        // 5. Highlight Active Nav Link
        highlightActiveNavLink();
    }; // End of initializeNavbarInteractions function

    // --- Highlight Active Nav Link (can be called independently) ---
    const highlightActiveNavLink = () => {
        // Normalize current pathname for comparison
        let currentPathname = window.location.pathname;
        // Remove trailing slash unless it's the root '/'
        if (currentPathname.endsWith('/') && currentPathname.length > 1) {
            currentPathname = currentPathname.slice(0, -1);
        }
        // Remove /index.html if present
        if (currentPathname.endsWith('/index.html')) {
            currentPathname = currentPathname.replace('/index.html', '');
        }
        // Handle root path specifically, so it matches '/'
        if (currentPathname === '') {
            currentPathname = '/';
        }

        const allLinks = document.querySelectorAll("nav.sticky a"); // Select all links within the navbar

        allLinks.forEach(link => {
            let linkPathname = new URL(link.href).pathname;
            // Normalize link pathname similarly
            if (linkPathname.endsWith('/') && linkPathname.length > 1) {
                linkPathname = linkPathname.slice(0, -1);
            }
            if (linkPathname.endsWith('/index.html')) {
                linkPathname = linkPathname.replace('/index.html', '');
            }
            if (linkPathname === '') {
                linkPathname = '/';
            }

            link.classList.remove("active"); // Remove active class from all links first

            // Compare normalized paths
            if (currentPathname === linkPathname) {
                link.classList.add("active");
                const parentDropdown = link.closest(".dropdown");
                if (parentDropdown) {
                    const dropbtn = parentDropdown.querySelector(".dropbtn");
                    if (dropbtn) {
                        dropbtn.classList.add("active"); // Also highlight the dropdown button
                    }
                }
            }
        });
    };

    // --- Handle window resize (for switching between mobile/desktop views) ---
    window.removeEventListener('resize', initializeNavbarInteractions); // Remove previous to prevent duplicates
    window.addEventListener('resize', initializeNavbarInteractions);

    // --- Fetch and Inject Navbar (Main Execution Flow) ---
    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
                // Log more details about the failed response
                console.error(`HTTP error! Status: ${response.status}, URL: ${response.url}`);
                throw new Error(`HTTP error! status: ${response.status} fetching ${navbarPath}`);
            }
            return response.text();
        })
        .then(html => {
            navbarContainer.innerHTML = html; // Inject the navbar HTML

            // Call initialization *after* HTML is in the DOM
            initializeNavbarInteractions();
        })
        .catch(error => {
            console.error("Failed to load or inject navbar:", error);
            navbarContainer.innerHTML = "<nav class='error-nav'><p>Error loading navigation. Please try again.</p></nav>";
        });
});
