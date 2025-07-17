// script.js

document.addEventListener('DOMContentLoaded', function() {
    const navbarDiv = document.querySelector('nav.sticky'); // Select the nav element directly

    // Define the base URL for your tools. This assumes your tools are in a 'tools' folder
    // directly under your main domain/repo root.
    const baseUrl = window.location.origin; // e.g., "https://hangga-hub.github.io"

    // --- Function to initialize all navbar interactions ---
    const initializeNavbarInteractions = () => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");
        const dropdowns = document.querySelectorAll(".dropdown");
        const dropbtns = document.querySelectorAll(".dropdown .dropbtn");
        
        // Determine if the current page is a sub-page (e.g., /tools/tool-name/index.html)
        const currentPathname = window.location.pathname;
        const isToolSubPage = /\/tools\/[^\/]+\/?(index\.html)?$/.test(currentPathname);

        // --- 1. Simplify Navbar for Mobile Sub-Pages ---
        if (isToolSubPage && window.innerWidth <= 768) { // Check if on a tool sub-page AND mobile
            // Remove the existing mobile home button if already added (useful on resize)
            let existingHomeBtn = navbarDiv.querySelector('.mobile-home-btn');
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
            homeBtn.href = baseUrl + "/"; // Link to the absolute home page URL
            homeBtn.textContent = "Home";
            homeBtn.classList.add('mobile-home-btn');
            
            if (navbarDiv) {
                // We add a specific style here to ensure the button is positioned correctly
                homeBtn.style.display = 'block'; // Make sure the JS shows it
                navbarDiv.appendChild(homeBtn);
            }

            // Clean up mobile menu and dropdown listeners for sub-pages
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
        let homeBtn = navbarDiv.querySelector('.mobile-home-btn');
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
            // Close all dropdowns when toggling the main menu
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
                event.stopPropagation(); // Stop event from bubbling up to document click listener immediately

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
            const dropdownContent = this.querySelector('.dropdown-content');
            // Only close dropdown if mouse is not moving into dropdown-content
            // or if it's moving completely outside the dropdown area
            if (dropdownContent && !dropdownContent.contains(event.relatedTarget)) {
                this.classList.remove('open');
            } else if (!dropdownContent) { // If there's no dropdown content, just close on leave
                this.classList.remove('open');
            }
        }


        // 2d. Close mobile menu and dropdowns when clicking outside
        document.removeEventListener("click", handleOutsideClick); // Ensure only one listener
        document.addEventListener("click", handleOutsideClick);

        function handleOutsideClick(event) {
            // Check if the click is outside the main nav area (including toggle and nav links)
            const isClickInsideNav = navbarDiv && navbarDiv.contains(event.target);
            
            if (!isClickInsideNav) {
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
        // Normalize current pathname: remove trailing slash and 'index.html' if present
        let currentPathname = window.location.pathname;
        if (currentPathname.endsWith('/')) {
            currentPathname = currentPathname.slice(0, -1);
        }
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
            if (linkPathname.endsWith('/')) {
                linkPathname = linkPathname.slice(0, -1);
            }
            if (linkPathname.endsWith('/index.html')) {
                linkPathname = linkPathname.replace('/index.html', '');
            }
            if (linkPathname === '') {
                linkPathname = '/';
            }

            link.classList.remove("active");

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
    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    function handleResize() {
        initializeNavbarInteractions(); 
    }

    // Initial call to set up navbar interactions when DOM is ready
    initializeNavbarInteractions(); 
});
