document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       0. NAVBAR
       ========================================================= */

    const navbar = document.getElementById("navbar");
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const navLinkItems = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    function closeMobileMenu() {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    }

    if (navToggle && navLinks) {

        navToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("open");
            navToggle.classList.toggle("open", isOpen);
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        navLinkItems.forEach(function (link) {
            link.addEventListener("click", closeMobileMenu);
        });
    }

    function updateNavbarOnScroll() {

        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 30);
        }

        let currentSection = "home";

        sections.forEach(function (section) {

            const rect = section.getBoundingClientRect();

            if (rect.top <= 120 && rect.bottom >= 120) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinkItems.forEach(function (link) {

            link.classList.toggle(
                "active",
                link.getAttribute("data-section") === currentSection
            );
        });
    }

    window.addEventListener("scroll", updateNavbarOnScroll, { passive: true });
    updateNavbarOnScroll();


    /* =========================================================
       1. AOS
       ========================================================= */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            once: true,
            easing: "ease-out-cubic"
        });
    }


    /* =========================================================
       2. VANILLA TILT
       ========================================================= */

    if (typeof VanillaTilt !== "undefined") {

        const tiltElements =
            document.querySelectorAll("[data-tilt]");

        if (tiltElements.length > 0) {

            VanillaTilt.init(tiltElements, {
                max: 8,
                speed: 500,
                glare: true,
                "max-glare": 0.15
            });

        }
    }


    /* =========================================================
       3. PARTICLES.JS
       ========================================================= */

    if (
        typeof particlesJS !== "undefined" &&
        document.getElementById("particles-js")
    ) {

        particlesJS("particles-js", {

            particles: {

                number: {
                    value: 45,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },

                color: {
                    value: "#ff3b30"
                },

                shape: {
                    type: "circle"
                },

                opacity: {
                    value: 0.18,
                    random: true
                },

                size: {
                    value: 2.2,
                    random: true
                },

                line_linked: {
                    enable: false,
                    distance: 150,
                    color: "#1e3a8a",
                    opacity: 0.15,
                    width: 1
                },

                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out"
                }
            },

            interactivity: {

                detect_on: "canvas",

                events: {

                    onhover: {
                        enable: false,
                        mode: "grab"
                    },

                    onclick: {
                        enable: false,
                        mode: "push"
                    }
                },

                modes: {

                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.4
                        }
                    }
                }
            },

            retina_detect: true
        });
    }

    console.log("Portfolio JavaScript berhasil dimuat.");

});
