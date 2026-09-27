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


    /* =========================================================
       4. ID CARD ELEMENT
       ========================================================= */

    const card =
        document.getElementById("idCardHolder");

    const strap =
        document.getElementById("idCardStrap");

    const clip =
        card
            ? card.querySelector(".id-card-clip")
            : null;

    const body =
        card
            ? card.querySelector(".id-card-body")
            : null;


    /*
       Kalau ID card tidak ditemukan,
       bagian ID card dilewati.
    */

    if (!card) {

        console.warn(
            "ID Card tidak ditemukan."
        );

        return;
    }


    /* =========================================================
       5. CARD PHYSICS
       ========================================================= */

    let angle = 0;

    let velocity = 0;

    let dragging = false;

    let pointerStartX = 0;

    let pointerStartY = 0;

    let startAngle = 0;

    let lastPointerX = 0;

    let lastTime = 0;

    let mouseVelocity = 0;


    /*
       Pengaturan fisika kartu.
    */

    const MAX_ANGLE = 32;

    const SPRING = 0.035;

    const DAMPING = 0.94;

    const DRAG_SENSITIVITY = 0.45;


    /* =========================================================
       6. PREVENT IMAGE DRAG
       ========================================================= */

    card.querySelectorAll("img").forEach(function (image) {

        image.addEventListener(
            "dragstart",
            function (event) {
                event.preventDefault();
            }
        );

    });


    /* =========================================================
       7. START DRAG
       ========================================================= */

    function startDrag(event) {

        dragging = true;

        card.classList.add("dragging");

        /*
           Matikan animasi CSS sementara.
        */

        card.classList.remove("swinging");
        card.classList.remove("snapping");

        if (strap) {
            strap.classList.remove("snapping");
        }


        let point;


        if (event.touches) {

            point = event.touches[0];

        } else {

            point = event;
        }


        pointerStartX =
            point.clientX;

        pointerStartY =
            point.clientY;

        startAngle =
            angle;

        lastPointerX =
            point.clientX;

        lastTime =
            performance.now();

        mouseVelocity = 0;

        velocity = 0;


        card.style.cursor =
            "grabbing";


        if (
            event.cancelable &&
            event.type !== "mousedown"
        ) {

            event.preventDefault();
        }
    }


    /* =========================================================
       8. MOVE DRAG
       ========================================================= */

    function moveDrag(event) {

        if (!dragging) {
            return;
        }


        let point;


        if (event.touches) {

            point = event.touches[0];

        } else {

            point = event;
        }


        const currentX =
            point.clientX;


        /*
           Jarak horizontal dari posisi awal.
        */

        const distanceX =
            currentX -
            pointerStartX;


        /*
           Ubah gerakan mouse
           menjadi rotasi kartu.
        */

        let newAngle =
            startAngle +
            distanceX *
            DRAG_SENSITIVITY;


        /*
           Batasi kemiringan.
        */

        if (newAngle > MAX_ANGLE) {
            newAngle = MAX_ANGLE;
        }

        if (newAngle < -MAX_ANGLE) {
            newAngle = -MAX_ANGLE;
        }


        angle =
            newAngle;


        /* -----------------------------------------------------
           Hitung kecepatan mouse
        ----------------------------------------------------- */

        const now =
            performance.now();


        const deltaTime =
            Math.max(
                1,
                now - lastTime
            );


        const deltaX =
            currentX -
            lastPointerX;


        mouseVelocity =
            deltaX /
            deltaTime;


        lastPointerX =
            currentX;

        lastTime =
            now;


        updateCard();


        if (
            event.cancelable &&
            event.type === "touchmove"
        ) {

            event.preventDefault();
        }
    }


    /* =========================================================
       9. RELEASE CARD
       ========================================================= */

    function stopDrag() {

        if (!dragging) {
            return;
        }


        dragging = false;

        card.classList.remove("dragging");


        card.style.cursor =
            "grab";


        /*
           Mouse velocity diubah menjadi momentum.
        */

        velocity =
            mouseVelocity * 10;


        /*
           Batasi momentum maksimum.
        */

        if (velocity > 5) {
            velocity = 5;
        }

        if (velocity < -5) {
            velocity = -5;
        }


        /*
           Target kembali ke tengah
           secara alami melalui spring.
        */

        card.classList.add("snapping");

        if (strap) {
            strap.classList.add("snapping");
        }


        /*
           Hapus class setelah animasi.
        */

        setTimeout(function () {

            card.classList.remove(
                "snapping"
            );

            if (strap) {

                strap.classList.remove(
                    "snapping"
                );
            }

        }, 700);
    }


    /* =========================================================
       10. MOUSE EVENTS
       ========================================================= */

    card.addEventListener(
        "mousedown",
        startDrag
    );


    window.addEventListener(
        "mousemove",
        moveDrag
    );


    window.addEventListener(
        "mouseup",
        stopDrag
    );


    /* =========================================================
       11. TOUCH EVENTS
       ========================================================= */

    card.addEventListener(
        "touchstart",
        startDrag,
        {
            passive: false
        }
    );


    window.addEventListener(
        "touchmove",
        moveDrag,
        {
            passive: false
        }
    );


    window.addEventListener(
        "touchend",
        stopDrag
    );


    window.addEventListener(
        "touchcancel",
        stopDrag
    );


    /* =========================================================
       12. UPDATE CARD VISUAL
       ========================================================= */

    function updateCard() {

        /*
           Card utama.
        */

        card.style.transform =
            "rotate(" +
            angle +
            "deg)";


        /* -----------------------------------------------------
           TALI
        ----------------------------------------------------- */

        if (strap) {

            /*
               Tali bergerak sedikit
               mengikuti kartu.
            */

            const strapAngle =
                angle * -0.20;


            strap.style.transform =
                "translateX(-50%) rotate(" +
                strapAngle +
                "deg)";
        }


        /* -----------------------------------------------------
           CLIP
        ----------------------------------------------------- */

        if (clip) {

            /*
               Clip bergerak lebih sedikit
               daripada kartu.
            */

            const clipAngle =
                angle * 0.25;


            clip.style.transform =
                "translateX(-50%) rotate(" +
                clipAngle +
                "deg)";
        }


        /* -----------------------------------------------------
           BODY
        ----------------------------------------------------- */

        if (body) {

            /*
               Sedikit efek 3D.
            */

            const bodyAngle =
                angle * 0.10;


            body.style.transform =
                "perspective(800px) rotateY(" +
                bodyAngle +
                "deg)";
        }
    }


    /* =========================================================
       13. PHYSICS LOOP
       ========================================================= */

    function physicsLoop() {

        /*
           Saat tidak sedang di-drag,
           physics berjalan.
        */

        if (!dragging) {

            /*
               Spring force.

               Semakin jauh kartu dari 0,
               semakin kuat ditarik kembali.
            */

            const springForce =
                -angle *
                SPRING;


            velocity +=
                springForce;


            /*
               Damping.

               Membuat ayunan perlahan berhenti.
            */

            velocity *=
                DAMPING;


            /*
               Gerakkan kartu.
            */

            angle +=
                velocity;


            /*
               Stop ketika sudah sangat dekat
               dengan posisi tengah.
            */

            if (
                Math.abs(angle) < 0.03 &&
                Math.abs(velocity) < 0.01
            ) {

                angle = 0;

                velocity = 0;
            }


            updateCard();
        }


        requestAnimationFrame(
            physicsLoop
        );
    }


    /* =========================================================
       14. NATURAL IDLE SWING
    ========================================================= */

    let idleDirection = 1;


    function giveIdleNudge() {

        /*
           Jangan ganggu ketika sedang di-drag.
        */

        if (dragging) {
            return;
        }


        /*
           Jangan beri dorongan jika kartu
           masih sedang berayun.
        */

        if (
            Math.abs(velocity) >
            0.15
        ) {

            return;
        }


        /*
           Ganti arah.
        */

        idleDirection *= -1;


        /*
           Dorongan kecil.
        */

        velocity =
            idleDirection *
            (
                0.20 +
                Math.random() * 0.15
            );
    }


    /*
       Ayunan kecil setiap beberapa detik.
    */

    setInterval(
        giveIdleNudge,
        4200
    );


    /* =========================================================
       15. HOVER
       ========================================================= */

    card.addEventListener(
        "mouseenter",
        function () {

            card.classList.add(
                "card-hover"
            );

        }
    );


    card.addEventListener(
        "mouseleave",
        function () {

            card.classList.remove(
                "card-hover"
            );

        }
    );


    /* =========================================================
       16. KEYBOARD CONTROL
       ========================================================= */

    card.setAttribute(
        "tabindex",
        "0"
    );


    card.addEventListener(
        "keydown",
        function (event) {

            /*
               Panah kiri.
            */

            if (
                event.key ===
                "ArrowLeft"
            ) {

                velocity -= 1;

                event.preventDefault();
            }


            /*
               Panah kanan.
            */

            if (
                event.key ===
                "ArrowRight"
            ) {

                velocity += 1;

                event.preventDefault();
            }


            /*
               Space = ayunkan.
            */

            if (
                event.key ===
                " "
            ) {

                velocity =
                    Math.random() > 0.5
                        ? 2
                        : -2;

                event.preventDefault();
            }

        }
    );


    /* =========================================================
       17. REDUCED MOTION
    ========================================================= */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (reducedMotion.matches) {

        angle = 0;

        velocity = 0;

        card.style.transform =
            "rotate(0deg)";

        if (strap) {

            strap.style.transform =
                "translateX(-50%) rotate(0deg)";
        }

        if (clip) {

            clip.style.transform =
                "translateX(-50%) rotate(0deg)";
        }
    }


    /* =========================================================
       18. INITIALIZE
    ========================================================= */

    card.style.cursor =
        "grab";


    updateCard();


    physicsLoop();


    /* =========================================================
       19. DEBUG MESSAGE
    ========================================================= */

    console.log(
        "✓ Portfolio JavaScript berhasil dimuat."
    );

    console.log(
        "✓ ID Card interactive aktif."
    );

});
