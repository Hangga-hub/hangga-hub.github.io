// Ensure all scripts run after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    const navbarPath = "https://hangga-hub.github.io/components/navbar.html";
    const navbarContainer = document.getElementById("navbar");

    if (!navbarContainer) {
        console.error("Error: Navbar container (#navbar) not found. Cannot load navigation.");
        return; // Exit if the container isn't there
    }

    // --- Function to initialize all navbar interactions ---
    // This function will be called *after* the navbar HTML is injected.
    const initializeNavbarInteractions = () => {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");
        const dropdowns = document.querySelectorAll(".dropdown");
        const dropbtns = document.querySelectorAll(".dropdown .dropbtn");

        // --- 1. Mobile Menu Toggle (Hamburger Icon) ---
        // Ensure listeners are applied only once, even if this function is called multiple times
        if (menuToggle && navLinks) {
            // Remove existing listener to prevent duplicates if initializeNavbarInteractions is called multiple times
            menuToggle.removeEventListener("click", toggleMobileMenu);
            menuToggle.addEventListener("click", toggleMobileMenu);
        }

        function toggleMobileMenu() {
            if (navLinks) {
                navLinks.classList.toggle("show");
            }
            // Close any open dropdowns when main menu is toggled
            dropdowns.forEach(openDropdown => {
                openDropdown.classList.remove("open");
            });
        }

        // --- 2. Dropdown Toggle for Mobile and Desktop ---
        dropbtns.forEach(btn => {
            // Remove previous listeners to prevent accumulation
            btn.removeEventListener("click", handleDropdownToggle);
            btn.removeEventListener("touchstart", handleDropdownToggle); // Use touchstart for faster response on mobile

            // Add new listeners
            btn.addEventListener("click", handleDropdownToggle);
            btn.addEventListener("touchstart", handleDropdownToggle);
        });

        function handleDropdownToggle(event) {
            // Check if it's a mobile screen based on your CSS breakpoint (768px)
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // For mobile, prevent default link behavior to handle dropdown toggle ourselves
                event.preventDefault(); 
                event.stopPropagation(); // Stop propagation to prevent document click from immediately closing

                const parentDropdown = this.closest(".dropdown"); // 'this' refers to the clicked dropbtn

                // Close other open dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== parentDropdown && otherDropdown.classList.contains("open")) {
                        otherDropdown.classList.remove("open");
                    }
                });

                // Toggle the current dropdown
                if (parentDropdown) {
                    parentDropdown.classList.toggle("open");
                }
            }
            // For desktop, CSS :hover handles it, so we don't need JS for click.
            // If there's a click on desktop, it acts as a normal link.
        }

        // --- 3. Desktop: show dropdown on hover (CSS handles most, but JS fallback can ensure) ---
        // Only apply hover listeners if on desktop
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

        function handleMouseLeave() {
            this.classList.remove('open');
        }


        // --- 4. Close mobile menu and dropdowns when clicking outside ---
        // We use event delegation on the document, so this needs to be robust
        document.removeEventListener("click", handleOutsideClick); // Ensure only one listener
        document.addEventListener("click", handleOutsideClick);

        function handleOutsideClick(event) {
            const isClickInsideNav = navLinks && navLinks.contains(event.target);
            const isClickOnToggle = menuToggle && menuToggle.contains(event.target);
            const isClickOnDropdownContent = event.target.closest('.dropdown-content');

            // If clicked outside the main mobile menu AND not on the toggle button
            // AND not inside an already open dropdown content area (to allow clicks within dropdown)
            if (!isClickInsideNav && !isClickOnToggle && !isClickOnDropdownContent) {
                if (navLinks && navLinks.classList.contains("show")) {
                    navLinks.classList.remove("show"); // Close mobile menu
                }
                // Also close any open dropdowns if clicked outside
                dropdowns.forEach(openDropdown => {
                    openDropdown.classList.remove("open");
                });
            }
        }
        
        // --- 5. Highlight Active Nav Link ---
        highlightActiveNavLink();

        // --- 6. Handle window resize (for switching between mobile/desktop views) ---
        window.removeEventListener('resize', handleResize); // Prevent duplicates
        window.addEventListener('resize', handleResize);

        function handleResize() {
            // On resize, if it becomes desktop view, close mobile menu and all dropdowns
            if (window.innerWidth > 768) {
                if (navLinks && navLinks.classList.contains("show")) {
                    navLinks.classList.remove("show");
                }
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove("open");
                });
            }
            // Re-initialize all interactions to correctly apply hover/click logic based on new width
            // This might seem redundant, but it ensures all listeners are correctly re-bound
            // according to the current window size, especially for hover vs click/touch.
            initializeNavbarInteractions(); 
        }
    }; // End of initializeNavbarInteractions function

    // --- Highlight Active Nav Link (moved outside, can be called independently) ---
    const highlightActiveNavLink = () => {
        const currentPathname = window.location.pathname;
        const allLinks = document.querySelectorAll(".nav-links a");
        
        allLinks.forEach(link => {
            const linkUrl = new URL(link.href);
            const linkPathname = linkUrl.pathname;
            
            // Normalize paths: remove trailing slash unless it's the root "/"
            const normalizedCurrentPath = currentPathname.endsWith('/') && currentPathname.length > 1
                ? currentPathname.slice(0, -1)
                : currentPathname;
            const normalizedLinkPath = linkPathname.endsWith('/') && linkPathname.length > 1
                ? linkPathname.slice(0, -1)
                : linkPathname;
            
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
    };

    // --- Fetch and Inject Navbar (Main Execution Flow) ---
    // This is the primary part that runs on DOMContentLoaded
    fetch(navbarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} fetching ${navbarPath}`);
            }
            return response.text();
        })
        .then(html => {
            navbarContainer.innerHTML = html; // Inject the navbar HTML
            // IMPORTANT: Call initialization *after* HTML is in the DOM
            initializeNavbarInteractions(); 
        })
        .catch(error => {
            console.error("Failed to load or inject navbar:", error);
            navbarContainer.innerHTML = "<nav class='error-nav'><p>Error loading navigation. Please try again.</p></nav>";
        });
});