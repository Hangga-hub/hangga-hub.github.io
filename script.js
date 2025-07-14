// script.js

document.addEventListener('DOMContentLoaded', function() {
    const navbarDiv = document.getElementById('navbar');

    // Create a simple navbar content
    // Note: Paths are relative to the root (index.html) or current directory for sub-pages
    // If this script is used on sub-pages in 'tools/' folder, paths like 'tools/bmi-calculator.html'
    // will need to be adjusted to '../tools/bmi-calculator.html' or similar.
    // For simplicity and assuming this script runs from the root or handles paths dynamically,
    // I'm keeping them as 'tools/tool-name.html'.
    // If you always load this from the root, these paths are fine.
    // If loaded from a sub-directory, you'll need to adjust the paths in the innerHTML.
    const isSubPage = window.location.pathname.includes('/tools/');
    const pathPrefix = isSubPage ? '../' : '';

    navbarDiv.innerHTML = `
        <nav class="sticky">
            <h1><a href="${pathPrefix}">Hangga's Tool Hub</a></h1>
            <button id="menuToggle" aria-label="Toggle menu"><i class="ri-menu-line"></i></button>
            <ul class="nav-links">
                <li><a href="${pathPrefix}">Home</a></li>
                <li class="dropdown">
                    <a href="#" class="dropbtn">Tools <i class="ri-arrow-down-s-line"></i></a>
                    <ul class="dropdown-content">
                        <li><a href="${pathPrefix}tools/bmi-calculator.html">BMI Calculator</a></li>
                        <li><a href="${pathPrefix}tools/json-validator.html">JSON Validator</a></li>
                        <li><a href="${pathPrefix}tools/unit-converter.html">Unit Converter</a></li>
                        <li><a href="${pathPrefix}tools/color-picker.html">Color Picker</a></li>
                        <li><a href="${pathPrefix}tools/loan-calculator.html">Loan Calculator</a></li>
                        <li><a href="${pathPrefix}tools/qr-code-generator.html">QR Code Generator</a></li>
                        <li><a href="${pathPrefix}tools/csv-json-converter.html">CSV ⇄ JSON Converter</a></li>
                        <li><a href="${pathPrefix}tools/image-converter.html">Image Converter</a></li>
                        <li><a href="${pathPrefix}tools/image-resizer.html">Image Resizer</a></li>
                    </ul>
                </li>
                <li><a href="https://github.com/hangga-hub" target="_blank">GitHub</a></li>
                <!-- Add more links as needed -->
            </ul>
        </nav>
    `;

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.nav-links .dropdown');

    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('show');
    });

    // Handle dropdowns for mobile
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        dropbtn.addEventListener('click', function(e) {
            // Prevent default link behavior, but only for mobile dropdowns
            if (window.innerWidth <= 768) { // Adjust breakpoint to match CSS
                e.preventDefault();
                dropdown.classList.toggle('open');
                // Close other open dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('open')) {
                        otherDropdown.classList.remove('open');
                    }
                });
            }
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', function(e) {
        // Check if the click is outside the navbar and the menu is open on mobile
        if (window.innerWidth <= 768 && !navbarDiv.contains(e.target) && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            dropdowns.forEach(dropdown => dropdown.classList.remove('open')); // Close any open dropdowns
        }
    });

    // Close dropdowns on desktop when mouse leaves the dropdown area
    if (window.innerWidth > 768) { // Desktop
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseleave', function() {
                dropdown.classList.remove('open');
            });
        });
    }

    // Add a "Home" button to the navbar on sub-pages for better navigation
    if (isSubPage) {
        const nav = navbarDiv.querySelector('nav');
        const homeButton = document.createElement('a');
        homeButton.href = pathPrefix; // Link back to the root
        homeButton.textContent = 'Home';
        homeButton.classList.add('mobile-home-btn'); // Apply specific styling
        nav.insertBefore(homeButton, nav.querySelector('h1').nextSibling); // Insert after the title
        
        // Hide main nav links on sub-pages by default on mobile
        // This makes the mobile-home-btn more prominent
        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
    }
});
