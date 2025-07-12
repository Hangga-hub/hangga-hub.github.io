// Ensure all scripts run after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Function to initialize navbar interactions ---
    // Encapsulate the logic to be callable after injection
    const initializeNavbarInteractions = () => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");

        if (!menuToggle || !navLinks) {
            console.error("Navbar elements (menuToggle or navLinks) not found after injection.");
            return; // Exit if essential elements are missing
        }

        // Mobile Menu Toggle (Hamburger Icon)
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");
            // Close any open dropdowns when main menu is toggled
            document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                openDropdown.classList.remove("open");
            });
        });

        // Dropdown Toggle for Mobile (Tap to open/close)
        document.querySelectorAll(".dropdown .dropbtn").forEach(btn => {
            // Remove any existing listeners to prevent duplicates
            btn.removeEventListener("click", handleDropdownClick);
            btn.removeEventListener("touchstart", handleDropdownClick);
            btn.addEventListener("click", handleDropdownClick);
            btn.addEventListener("touchstart", handleDropdownClick);
        });

        // Handler for dropdown button clicks (supports both click and touch)
        function handleDropdownClick(e) {
            // Only activate this JS for mobile widths (<= 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parentDropdown = this.parentElement;
                document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                    if (openDropdown !== parentDropdown) {
                        openDropdown.classList.remove("open");
                    }
                });
                parentDropdown.classList.toggle("open");
            }
        }

        // Close mobile menu and dropdowns when clicking outside
        document.removeEventListener("click", handleOutsideClick); // Remove old listener
        document.addEventListener("click", handleOutsideClick); // Add new listener

        function handleOutsideClick(event) {
            // Ensure navLinks and menuToggle still exist (safety check)
            if (!navLinks || !menuToggle) return;

            const isClickInsideNav = navLinks.contains(event.target) || menuToggle.contains(event.target);
            const isDropdownClick = event.target.closest('.dropdown');

            // If clicked outside the main menu area AND not on a dropdown item/button itself
            if (!isClickInsideNav && !isDropdownClick) {
                if (navLinks.classList.contains("show")) {
                    navLinks.classList.remove("show"); // Close mobile menu
                }
                document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                    openDropdown.classList.remove("open"); // Close any open dropdowns
                });
            }
        }

        // Highlight Active Nav Link
        const currentPathname = window.location.pathname; // e.g., "/bmi-calculator" or "/"
        
        document.querySelectorAll(".nav-links a").forEach(link => {
            // Get the pathname part of the link's href
            const linkPathname = new URL(link.href).pathname;

            // Normalize paths: remove trailing slash unless it's the root "/"
            const normalizedCurrentPath = currentPathname.endsWith('/') && currentPathname.length > 1
                ? currentPathname.slice(0, -1)
                : currentPathname;
            const normalizedLinkPath = linkPathname.endsWith('/') && linkPathname.length > 1
                ? linkPathname.slice(0, -1)
                : linkPathname;
            
            // Remove 'active' class from all links first to ensure only one is active
            link.classList.remove("active");

            // Check for exact match (after normalization)
            if (normalizedCurrentPath === normalizedLinkPath) {
                link.classList.add("active");
                // If it's a dropdown item, also highlight its parent dropdown button
                const parentDropdown = link.closest(".dropdown");
                if (parentDropdown) {
                    const dropbtn = parentDropdown.querySelector(".dropbtn");
                    if (dropbtn) {
                        dropbtn.classList.add("active");
                    }
                }
            }
        });

        // Add a listener for window resize to handle switching between mobile/desktop views
        // This ensures the menu state is reset if user resizes from mobile to desktop
        window.removeEventListener('resize', handleResize); // Prevent duplicate listeners
        window.addEventListener('resize', handleResize);

        function handleResize() {
            if (window.innerWidth > 768) { // If desktop view
                if (navLinks.classList.contains("show")) {
                    navLinks.classList.remove("show"); // Hide mobile menu
                }
                document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                    openDropdown.classList.remove("open"); // Close any open dropdowns
                });
            }
        }
    };

    // --- 2. Fetch and Inject Navbar ---
    const navbarPath = "https://hangga-hub.github.io/components/navbar.html";

    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} fetching ${navbarPath}`);
            }
            return response.text();
        })
        .then(html => {
            const navbarContainer = document.getElementById("navbar");
            if (navbarContainer) {
                navbarContainer.innerHTML = html; // Inject the navbar HTML
                // Delay initialization to ensure DOM is ready
                setTimeout(() => {
                    initializeNavbarInteractions();
                }, 50);
            } else {
                console.error("Error: Navbar container (#navbar) not found in index.html. Cannot inject navbar.");
            }
        })
        .catch(error => {
            console.error("Failed to load or inject navbar:", error);
            // Fallback: If navbar fails to load, consider a static placeholder or message
            const navbarContainer = document.getElementById("navbar");
            if (navbarContainer) {
                navbarContainer.innerHTML = "<nav class='error-nav'><p>Error loading navigation. Please try again.</p></nav>";
            }
        });
});