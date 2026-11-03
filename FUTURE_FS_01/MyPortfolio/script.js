document.addEventListener("DOMContentLoaded", function () {

    // Dynamic role typing animation
    const typingElement = document.getElementById("typing-text");

    const roles = [
        "Backend Development",
        "Java Programming",
        "REST API Design",
        "Database Management",
        "Full Stack Development"
    ];

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeRole() {
        if (!typingElement) return;

        const currentRole = roles[roleIndex];

        if (deleting) {
            characterIndex--;
        } else {
            characterIndex++;
        }

        typingElement.textContent = currentRole.substring(0, characterIndex);

        let delay = deleting ? 35 : 75;

        if (!deleting && characterIndex === currentRole.length) {
            deleting = true;
            delay = 1400;
        } else if (deleting && characterIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(typeRole, delay);
    }

    if (typingElement) {
        typeRole();
    }

    // Automatically update the footer year
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Close the mobile navigation after selecting a section
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const navbarCollapse = document.getElementById("navbarNav");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (
                navbarCollapse &&
                navbarCollapse.classList.contains("show")
            ) {
                const collapseInstance =
                    bootstrap.Collapse.getOrCreateInstance(navbarCollapse);

                collapseInstance.hide();
            }
        });
    });

    // Highlight the navigation link for the visible section
    const sections = document.querySelectorAll("section[id]");
    const allNavLinks = document.querySelectorAll(".nav-link");

    function updateActiveLink() {
        let currentSection = "home";

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {
                currentSection = section.id;
            }
        });

        allNavLinks.forEach(function (link) {
            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();

});


const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        Swal.fire({
            icon: "success",
            title: "Message Submitted!",
            text: "Thank you for reaching out. I appreciate your interest!",
            background: "#181818",
            color: "#ffffff",
            confirmButtonText: "Thank You!",
            confirmButtonColor: "#c5f82a",
            customClass: {
                popup: "portfolio-alert",
                confirmButton: "portfolio-alert-btn"
            },
            buttonsStyling: true
        });

        contactForm.reset();
    });
}