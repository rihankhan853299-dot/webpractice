document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const toggleIcon = menuToggle.querySelector("i");

    // Toggle menu on click
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        // Icon change script (Hamburger menu icon transforms into 'X' close icon)
        if (navLinks.classList.contains("active")) {
            toggleIcon.classList.remove("bi-list");
            toggleIcon.classList.add("bi-x-lg");
        } else {
            toggleIcon.classList.remove("bi-x-lg");
            toggleIcon.classList.add("bi-list");
        }
    });

    // Close menu when clicking outside of it
    document.addEventListener("click", (event) => {
        if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
            navLinks.classList.remove("active");
            toggleIcon.classList.remove("bi-x-lg");
            toggleIcon.classList.add("bi-list");
        }
    });
});
