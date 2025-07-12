// Ensure all scripts run after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Inject global navbar content ---
    // Make sure this path is correct relative to your index.html
    // If navbar.html is in the same directory, use "navbar.html"
    // If it's in a 'components' folder at the root, and you are serving from GitHub Pages root,
    // then 'https://hangga-hub.github.io/components/navbar.html' is correct.
    const navbarPath = "https://hangga-hub.github.io/components/navbar.html";

    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
                // If the network response is not OK, throw an error
                throw new Error(`HTTP error! status: ${response.status} fetching ${navbarPath}`);
            }
            return response.text();
        })
        .then(html => {
            const navbarContainer = document.getElementById("navbar");
            if (navbarContainer) {
                navbarContainer.innerHTML = html; // Inject the navbar HTML

                // --- 2. Attach Event Listeners AFTER Navbar is Injected ---

                // Mobile Menu Toggle (Hamburger Icon)
                const menuToggle = document.getElementById("menuToggle");
                const navLinks = document.querySelector(".nav-links");

                if (menuToggle && navLinks) {
                    menuToggle.addEventListener("click", () => {
                        navLinks.classList.toggle("show");
                        // Close any open dropdowns when main menu is toggled
                        document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                            openDropdown.classList.remove("open");
                        });
                    });
                }

                // Dropdown Toggle for Mobile (Tap to open/close)
                document.querySelectorAll(".dropdown .dropbtn").forEach(btn => {
                    btn.addEventListener("click", e => {
                        // Only activate this JS for mobile widths (less than or equal to 768px)
                        if (window.innerWidth <= 768) {
                            e.preventDefault(); // Prevent default link behavior for dropdown button

                            const parentDropdown = btn.parentElement; // The <li> with class "dropdown"

                            // Close any other open dropdowns *before* toggling the current one
                            document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                                if (openDropdown !== parentDropdown) { // Don't close the current one
                                    openDropdown.classList.remove("open");
                                }
                            });

                            // Toggle the 'open' class on the current dropdown
                            parentDropdown.classList.toggle("open");
                        }
                    });
                });

                // Close mobile menu and dropdowns when clicking outside
                document.addEventListener("click", (event) => {
                    if (navLinks && menuToggle) {
                        const isClickInsideNav = navLinks.contains(event.target) || menuToggle.contains(event.target);
                        const isDropdownClick = event.target.closest('.dropdown');

                        // If clicked outside the main menu area AND not on a dropdown item/button itself
                        if (!isClickInsideNav && !isDropdownClick) {
                            navLinks.classList.remove("show"); // Close mobile menu
                            document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                                openDropdown.classList.remove("open"); // Close any open dropdowns
                            });
                        }
                    }
                });

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
                    
                    // Check for exact match (after normalization)
                    if (normalizedCurrentPath === normalizedLinkPath) {
                        link.classList.add("active");
                        // If it's a dropdown item, also highlight its parent dropdown button
                        const parentDropdown = link.closest(".dropdown");
                        if (parentDropdown) {
                            // Find the direct child <a> with class 'dropbtn' and add 'active'
                            const dropbtn = parentDropdown.querySelector(".dropbtn");
                            if (dropbtn) {
                                dropbtn.classList.add("active");
                            }
                        }
                    }
                });

            } else {
                console.error("Error: Navbar container (#navbar) not found in index.html. Cannot inject navbar.");
            }
        })
        .catch(error => {
            console.error("Failed to load or inject navbar:", error);
            // Optionally, display a fallback message or UI here
        });
});