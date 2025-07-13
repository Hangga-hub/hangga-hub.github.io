// Ensure all scripts run after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Event Listeners (using delegation for efficiency) ---
    // Listen for clicks on the entire document to handle clicks on the navbar and dropdowns.
    document.addEventListener("click", (event) => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");

        // Handle the mobile menu toggle
        if (menuToggle && menuToggle.contains(event.target)) {
            if (navLinks) {
                navLinks.classList.toggle("show");
            }
            // Close any open dropdowns when the main menu is toggled
            document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                openDropdown.classList.remove("open");
            });
            event.stopPropagation(); // Stop propagation to prevent immediate closing
            return;
        }

        // Handle the dropdown toggle
        const dropdownBtn = event.target.closest(".dropbtn");
        if (dropdownBtn) {
            const parentDropdown = dropdownBtn.closest(".dropdown");
            if (parentDropdown) {
                // Close other dropdowns
                document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                    if (openDropdown !== parentDropdown) {
                        openDropdown.classList.remove("open");
                    }
                });
                parentDropdown.classList.toggle("open");
            }
            event.preventDefault(); // Prevent default link behavior for dropdown button
            return;
        }

        // Handle clicks outside the navbar and dropdowns to close them
        const isClickInsideNav = navLinks && navLinks.contains(event.target);
        if (!isClickInsideNav) {
            if (navLinks && navLinks.classList.contains("show")) {
                navLinks.classList.remove("show"); // Close mobile menu
            }
            document.querySelectorAll(".dropdown.open").forEach(openDropdown => {
                openDropdown.classList.remove("open"); // Close any open dropdowns
            });
        }
    });

    // Handle desktop hover functionality
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.addEventListener("mouseenter", () => {
            dropdown.classList.add("open");
        });
        dropdown.addEventListener("mouseleave", () => {
            dropdown.classList.remove("open");
        });
    });

    // --- 2. Function to load and initialize navbar ---
    const loadNavbar = () => {
        const navbarContainer = document.getElementById("navbar");
        const navbarPath = "https://hangga-hub.github.io/components/navbar.html";

        if (!navbarContainer) {
            console.error("Error: Navbar container (#navbar) not found.");
            return;
        }

        fetch(navbarPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                navbarContainer.innerHTML = html;
                highlightActiveNavLink(); // Highlight the current link after injection
            })
            .catch(error => {
                console.error("Failed to load navbar:", error);
                navbarContainer.innerHTML = "<nav class='error-nav'><p>Error loading navigation. Please try again.</p></nav>";
            });
    };

    // --- 3. Highlight the active nav link ---
    const highlightActiveNavLink = () => {
        const currentPathname = window.location.pathname;
        const allLinks = document.querySelectorAll(".nav-links a");
        
        allLinks.forEach(link => {
            const linkPathname = new URL(link.href).pathname;
            const normalizedCurrentPath = currentPathname.endsWith('/') && currentPathname.length > 1 ? currentPathname.slice(0, -1) : currentPathname;
            const normalizedLinkPath = linkPathname.endsWith('/') && linkPathname.length > 1 ? linkPathname.slice(0, -1) : linkPathname;
            
            link.classList.remove("active");

            if (normalizedCurrentPath === normalizedLinkPath) {
                link.classList.add("active");
                const parentDropdown = link.closest(".dropdown");
                if (parentDropdown) {
                    const dropbtn = parentDropdown.querySelector(".dropbtn");
                    if (dropbtn) {
                        dropbtn.classList.add("active");
                    }
                }
            }
        });
    };

    // --- 4. Call the main function to start the process ---
    loadNavbar();
});