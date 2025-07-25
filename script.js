// script.js

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");

    if (!navbarContainer) {
        console.error("Error: Navbar container (#navbar) not found. Cannot load navigation.");
        return;
    }

    // Determine the base path for assets. This is crucial for GitHub Pages
    // where the site might be hosted in a subdirectory (e.g., /repo-name/).
    // This logic aims to get the "root" of your project (e.g., "/your-repo-name/" or just "/")
    let basePath = window.location.pathname;

    // Remove the HTML file name from the path if present (e.g., /index.html, /index2.html)
    const htmlFileMatch = basePath.match(/\/[^/]+\.html$/);
    if (htmlFileMatch) {
        basePath = basePath.substring(0, basePath.lastIndexOf('/'));
    }

    // If it's a tool sub-page (e.g., /tools/bmi-calculator), go up to the project root
    // (assuming tools are directly under the repo root or a fixed /tools/ directory)
    // This ensures basePath correctly points to the root of the application.
    if (basePath.includes('/tools/')) {
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
    // Assuming 'components' is always directly under the determined basePath
    const navbarPath = window.location.origin + basePath + "/components/navbar.html";

    console.log("Attempting to fetch navbar from:", navbarPath);

    // --- Function to initialize all navbar interactions ---
    const initializeNavbarInteractions = () => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");
        const dropdowns = document.querySelectorAll(".dropdown");
        const dropbtns = document.querySelectorAll(".dropdown > .dropbtn"); // Only top-level dropdown buttons
        const subDropdowns = document.querySelectorAll(".sub-dropdown"); // All sub-dropdowns
        const subDropbtns = document.querySelectorAll(".sub-dropdown > .sub-dropbtn"); // All sub-dropdown buttons


        // 1. Mobile Menu Toggle (Hamburger Icon)
        if (menuToggle && navLinks) {
            menuToggle.addEventListener("click", (e) => {
                e.stopPropagation();
                navLinks.classList.toggle("show");
                
                // Update aria-expanded for accessibility
                const isExpanded = navLinks.classList.contains("show");
                menuToggle.setAttribute("aria-expanded", isExpanded);
                
                // Close all dropdowns and sub-dropdowns when toggling the main menu
                dropdowns.forEach(openDropdown => {
                    openDropdown.classList.remove("open");
                });
                subDropdowns.forEach(openSubDropdown => {
                    openSubDropdown.classList.remove("open");
                });
            });
        }

        // 2. Top-level Dropdown Toggle for Mobile
        dropbtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const currentIsMobile = window.innerWidth <= 768;
                const parentDropdown = btn.closest(".dropdown");

                if (currentIsMobile) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other top-level dropdowns and all sub-dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== parentDropdown) {
                            otherDropdown.classList.remove("open");
                        }
                    });
                    subDropdowns.forEach(openSubDropdown => {
                        openSubDropdown.classList.remove("open"); // Close all sub-dropdowns
                    });

                    // Toggle current top-level dropdown
                    if (parentDropdown) {
                        parentDropdown.classList.toggle("open");
                    }
                }
            });
        });

        // 3. Sub-dropdown Toggle for Mobile
        subDropbtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const currentIsMobile = window.innerWidth <= 768;
                const parentSubDropdown = btn.closest(".sub-dropdown");

                if (currentIsMobile) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close other sub-dropdowns within the same parent dropdown
                    parentSubDropdown.closest(".dropdown-content").querySelectorAll(".sub-dropdown").forEach(otherSubDropdown => {
                        if (otherSubDropdown !== parentSubDropdown) {
                            otherSubDropdown.classList.remove("open");
                        }
                    });

                    // Toggle current sub-dropdown
                    if (parentSubDropdown) {
                        parentSubDropdown.classList.toggle("open");
                    }
                }
            });
        });

        // 4. Close menu when clicking outside
        document.addEventListener("click", (e) => {
            const navbarNav = document.querySelector('nav.sticky');
            const isClickInsideNav = navbarNav && navbarNav.contains(e.target);

            if (!isClickInsideNav) {
                if (navLinks && navLinks.classList.contains("show")) {
                    navLinks.classList.remove("show");
                    menuToggle.setAttribute("aria-expanded", "false");
                }
                dropdowns.forEach(openDropdown => {
                    openDropdown.classList.remove("open");
                });
                subDropdowns.forEach(openSubDropdown => {
                    openSubDropdown.classList.remove("open");
                });
            }
        });

        // 5. Handle window resize
        const handleResize = () => {
            if (window.innerWidth > 768) {
                // Desktop view - ensure menu is visible and reset states
                if (navLinks) navLinks.classList.remove("show"); // Remove 'show' class on desktop
                dropdowns.forEach(dropdown => dropdown.classList.remove("open"));
                subDropdowns.forEach(subDropdown => subDropdown.classList.remove("open")); // Close sub-dropdowns on desktop
                menuToggle.setAttribute("aria-expanded", "false");
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initialize on load

        // 6. Highlight Active Nav Link
        highlightActiveNavLink();
    }; // End of initializeNavbarInteractions function

    // --- Highlight Active Nav Link ---
    const highlightActiveNavLink = () => {
        const currentPathname = window.location.pathname;
        const allLinks = document.querySelectorAll("nav.sticky a");

        allLinks.forEach(link => {
            link.classList.remove("active"); // Remove active class from all links first

            let linkHref = new URL(link.href).pathname; // Get pathname from link's href

            // Special handling for root and index files for active state
            if (linkHref === '/' || linkHref === '/index.html') {
                if (currentPathname === '/' || currentPathname === '/index.html') {
                    link.classList.add("active");
                }
            } else if (linkHref === '/index2.html') {
                if (currentPathname === '/index2.html') {
                    link.classList.add("active");
                }
            } else if (currentPathname.startsWith(linkHref) && linkHref !== '/') {
                // For other tool links, check if current path starts with the link's path
                // and ensure it's not just the root link (which is handled above)
                link.classList.add("active");
            }

            // Also highlight the dropdown button if a child link is active
            if (link.classList.contains("active")) {
                // Highlight parent top-level dropdown button
                const parentDropdown = link.closest(".dropdown");
                if (parentDropdown) {
                    const dropbtn = parentDropdown.querySelector(".dropbtn");
                    if (dropbtn) {
                        dropbtn.classList.add("active");
                    }
                }

                // Highlight parent sub-dropdown button
                const parentSubDropdown = link.closest(".sub-dropdown");
                if (parentSubDropdown) {
                    const subDropbtn = parentSubDropdown.querySelector(".sub-dropbtn");
                    if (subDropbtn) {
                        subDropbtn.classList.add("active");
                    }
                }
            }
        });
    };

    // --- Fetch and Inject Navbar (Main Execution Flow) ---
    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
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
