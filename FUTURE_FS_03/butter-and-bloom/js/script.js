
/* Butter & Bloom — Demo Website */

// Automatically update the copyright year.
const yearElement = document.getElementById("currentYear");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Close the mobile menu after clicking a navigation link.
const navigationLinks = document.querySelectorAll(
    "#bakeryNav .nav-link"
);

const navigationMenu = document.getElementById("bakeryNav");

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        if (
            navigationMenu &&
            navigationMenu.classList.contains("show") &&
            window.bootstrap
        ) {
            const menu = bootstrap.Collapse.getOrCreateInstance(
                navigationMenu
            );

            menu.hide();
        }
    });
});
