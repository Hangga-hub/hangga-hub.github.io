// Ensure all scripts run after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    const navbarPath = "https://hangga-hub.github.io/components/navbar.html";
    const navbarContainer = document.getElementById("navbar");
    
    // Determine if the current page is the homepage.
    // We check if the pathname is "/" or "/index.html" (normalized).
    const isHomePage = window.location.pathname === "/" || window.location.pathname === "/index.html" || window.location.pathname === "/index.html/";
    
    // Determine if the user is on a mobile device based on the viewport width (matching your CSS breakpoint).
    const isMobile = window.innerWidth <= 768;

    if (!navbarContainer) {
        console.error("Error: Navbar container (#navbar) not found. Cannot load navigation.");
        return; 
    }

    // --- Function to initialize all navbar interactions ---
    // This is called after the navbar HTML is injected.
    const initializeNavbarInteractions = () => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");
        const dropdowns = document.querySelectorAll(".dropdown");
        const dropbtns = document.querySelectorAll(".dropdown .dropbtn");
        const navSticky = document.querySelector("nav.sticky");

        // --- 1. Simplify Navbar for Mobile Sub-Pages ---
        if (!isHomePage && isMobile) {
            
            // Remove the existing mobile home button if already added (useful on resize)
            let existingHomeBtn = navSticky.querySelector('.mobile-home-btn');
            if (existingHomeBtn) {
                existingHomeBtn.remove();
            }

            // Hide the complex nav elements via CSS display
            if (menuToggle) {
                menuToggle.style.display = 'none';
            }
            if (navLinks) {
                navLinks.style.display = 'none';
            }

            // Create and append Home button
            const homeBtn = document.createElement('a');
            homeBtn.href = "https://hangga-hub.github.io/"; // Your home page URL
            homeBtn.textContent = "Home";
            homeBtn.classList.add('mobile-home-btn');
            
            if (navSticky) {
                // We add a specific style here to ensure the button is positioned correctly
                homeBtn.style.display = 'block'; // Make sure the JS shows it
                navSticky.appendChild(homeBtn);
            }

            // Clean up mobile menu and dropdown listeners for sub-pages
            // We specifically remove these listeners to prevent any conflict/freezing on sub-pages.
            if (menuToggle) {
                menuToggle.removeEventListener("click", toggleMobileMenu);
            }
            dropbtns.forEach(btn => {
                btn.removeEventListener("click", handleDropdownToggle);
                btn.removeEventListener("touchstart", handleDropdownToggle);
            });
            dropdowns.forEach(d => d.classList.remove("open")); // Close any open dropdowns

            // Exit the function early for simple sub-page mobile view
            return; 
        }

        // --- 2. Standard Navbar Initialization (Home Page & All Desktop Views) ---

        // Ensure elements are visible (in case they were hidden by the mobile sub-page logic on resize)
        if (menuToggle) {
            menuToggle.style.display = ''; // Reset display style
        }
        if (navLinks) {
            navLinks.style.display = ''; // Reset display style
        }
        
        // Remove the dynamically added mobile home button if present
        let homeBtn = navSticky.querySelector('.mobile-home-btn');
        if (homeBtn) {
            homeBtn.remove();
        }

        // 2a. Mobile Menu Toggle (Hamburger Icon)
        if (menuToggle && navLinks) {
            // Remove previous listener and re-add for robustness
            menuToggle.removeEventListener("click", toggleMobileMenu); 
            menuToggle.addEventListener("click", toggleMobileMenu);
        }

        function toggleMobileMenu() {
            if (navLinks) {
                navLinks.classList.toggle("show");
            }
            dropdowns.forEach(openDropdown => {
                openDropdown.classList.remove("open");
            });
        }

        // 2b. Dropdown Toggle for Mobile (Home Page) and Desktop
        dropbtns.forEach(btn => {
            btn.removeEventListener("click", handleDropdownToggle);
            btn.removeEventListener("touchstart", handleDropdownToggle);

            btn.addEventListener("click", handleDropdownToggle);
            btn.addEventListener("touchstart", handleDropdownToggle);
        });

        function handleDropdownToggle(event) {
            // Re-check mobile status dynamically on interaction
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

        // 2c. Desktop: show dropdown on hover (JS fallback/reinforcement)
        if (window.innerWidth > 768) {
            dropdowns.forEach(dropdown => {
                dropdown.removeEventListener('mouseenter', handleMouseEnter);
                dropdown.removeEventListener('mouseleave', handleMouseLeave);

                dropdown.addEventListener('mouseenter', handleMouseEnter);
                dropdown.addEventListener('mouseleave', handleMouseLeave);
            });
        }

        function handleMouseEnter() {
            this.classList.add('open');
        }

        function handleMouseLeave(event) {
            // Only close dropdown if mouse is not moving into dropdown-content
            const dropdownContent = this.querySelector('.dropdown-content');
            if (dropdownContent) {
                // Check if mouse is moving into dropdown-content
                const related = event.relatedTarget;
                if (dropdownContent.contains(related)) {
                    // Don't close if moving into dropdown-content
                    return;
                }
            }
            this.classList.remove('open');
        }

        // 2d. Close mobile menu and dropdowns when clicking outside
        document.removeEventListener("click", handleOutsideClick); // Ensure only one listener
        document.addEventListener("click", handleOutsideClick);

        function handleOutsideClick(event) {
            const isClickInsideNav = navLinks && navLinks.contains(event.target);
            const isClickOnToggle = menuToggle && menuToggle.contains(event.target);
            const isClickOnDropdownContent = event.target.closest('.dropdown-content');

            if (!isClickInsideNav && !isClickOnToggle && !isClickOnDropdownContent) {
                if (navLinks && navLinks.classList.contains("show")) {
                    navLinks.classList.remove("show");
                }
                dropdowns.forEach(openDropdown => {
                    openDropdown.classList.remove("open");
                });
            }
        }
        
        // 2e. Highlight Active Nav Link (always applies)
        highlightActiveNavLink();
    }; // End of initializeNavbarInteractions function


    // --- Highlight Active Nav Link (can be called independently) ---
    const highlightActiveNavLink = () => {
        const currentPathname = window.location.pathname.endsWith('/') && window.location.pathname.length > 1
            ? window.location.pathname.slice(0, -1)
            : window.location.pathname;

        // Note: We select all links within the injected nav links (which should exist by now)
        const allLinks = document.querySelectorAll(".nav-links a");
        
        allLinks.forEach(link => {
            const linkUrl = new URL(link.href);
            const linkPathname = linkUrl.pathname.endsWith('/') && linkUrl.pathname.length > 1
                ? linkUrl.pathname.slice(0, -1)
                : linkUrl.pathname;
            
            link.classList.remove("active");

            if (currentPathname === linkPathname) {
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

    // --- Handle window resize (for switching between mobile/desktop views) ---
    // We re-call the initialization logic on resize to adapt the layout and listeners
    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    function handleResize() {
        // Re-calculate mobile status
        const isCurrentlyMobile = window.innerWidth <= 768;
        
        // Re-initialize the navbar interactions. 
        // This ensures the correct behavior (simple vs. complex) based on the new window size.
        initializeNavbarInteractions(); 
    }

    // --- Fetch and Inject Navbar (Main Execution Flow) ---
    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
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