(() => {

    /* CORE HEADER INITIALIZATION RUNS IMMEDIATELY
       TO PREVENT HEADER FLICKER / SHIFT ON PAGE LOAD. */

    const root = document.documentElement;
    const body = document.body;

    const themeToggle = document.querySelector("[data-theme-toggle]");
    const rtlToggle = document.querySelector("[data-rtl-toggle]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-nav-menu]");


    /* =========================================================
       SAVED THEME & DIRECTION
    ========================================================= */

    const savedTheme = localStorage.getItem("inkDenTheme");
    const savedDirection = localStorage.getItem("inkDenDirection");

    /*
       IMPORTANT:
       Apply saved theme before the rest of the header
       initialization so the header does not visually
       switch after the page has already appeared.
    */

    if (savedTheme === "dark") {
        root.dataset.theme = "dark";
    } else {
        delete root.dataset.theme;
    }

    const initialDirection =
        savedDirection === "rtl" ? "rtl" : "ltr";

    applyDirection(initialDirection);


    /* =========================================================
       ICON MAP
    ========================================================= */

    /* =========================================================
       LUCIDE ICON INITIALIZER
       All interface icons use Lucide. Footer social brands
       remain Font Awesome in the HTML.
    ========================================================= */

    function icons() {

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons({
                attrs: {
                    "stroke-width": 1.8
                }
            });
        }

    }


    /* =========================================================
       SET ICON
    ========================================================= */

    function setIcon(element, name) {

        if (!element) return;

        element.innerHTML = `<i data-lucide="${name}"></i>`;
        icons();

    }


    /* =========================================================
       THEME ICON
    ========================================================= */

    function updateThemeIcon() {

        if (!themeToggle) return;

        const iconName =
            root.dataset.theme === "dark" ? "sun" : "moon";

        themeToggle.innerHTML =
            `<i data-lucide="${iconName}"></i>`;

        icons();

    }


    /* =========================================================
       DIRECTION
    ========================================================= */

    function applyDirection(direction) {

        const dir =
            direction === "rtl"
                ? "rtl"
                : "ltr";

        root.setAttribute(
            "dir",
            dir
        );

        body.setAttribute(
            "dir",
            dir
        );

        root.classList.toggle(
            "rtl-mode",
            dir === "rtl"
        );

        root.classList.toggle(
            "ltr-mode",
            dir === "ltr"
        );

        body.classList.toggle(
            "rtl-mode",
            dir === "rtl"
        );

        body.classList.toggle(
            "ltr-mode",
            dir === "ltr"
        );

        localStorage.setItem(
            "inkDenDirection",
            dir
        );

    }


    /* =========================================================
       DARK MODE
    ========================================================= */

    themeToggle?.addEventListener(
        "click",
        () => {

            const dark =
                root.dataset.theme === "dark";

            if (dark) {

                delete root.dataset.theme;

                localStorage.setItem(
                    "inkDenTheme",
                    "light"
                );

            } else {

                root.dataset.theme =
                    "dark";

                localStorage.setItem(
                    "inkDenTheme",
                    "dark"
                );

            }

            updateThemeIcon();

        }
    );


    /* =========================================================
       RTL / LTR TOGGLE
    ========================================================= */

    rtlToggle?.addEventListener(
        "click",
        () => {

            const currentDirection =
                root.getAttribute("dir") ||
                "ltr";

            const nextDirection =
                currentDirection === "rtl"
                    ? "ltr"
                    : "rtl";

            applyDirection(
                nextDirection
            );

        }
    );


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    menuToggle?.addEventListener(
        "click",
        () => {

            const open =
                nav?.classList.toggle("open");

            document.body.classList.toggle(
                "menu-open",
                open
            );

            menuToggle.setAttribute(
                "aria-expanded",
                open ? "true" : "false"
            );

            menuToggle.innerHTML =
                `<i data-lucide="${open ? "x" : "menu"}"></i>`;

            icons();

        }
    );


    /* =========================================================
       HOME DROPDOWN
    ========================================================= */

    document
        .querySelectorAll(".nav-trigger")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 768
                    ) {

                        button
                            .closest(".nav-item")
                            ?.classList.toggle(
                                "open"
                            );

                    }

                }
            );

        });


    /* =========================================================
       CLOSE MOBILE MENU AFTER LINK CLICK
    ========================================================= */

    document
        .querySelectorAll(
            "[data-nav-menu] a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    nav?.classList.remove(
                        "open"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );

                    menuToggle?.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    if (menuToggle) {
                        menuToggle.innerHTML =
                            `<i data-lucide="menu"></i>`;
                        icons();
                    }

                }
            );

        });


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const current =
        location.pathname
            .split("/")
            .pop() ||
        "index.html";

    document
        .querySelectorAll(
            "[data-nav-menu] a"
        )
        .forEach(link => {

            const href =
                link.getAttribute("href")
                    ?.split("#")[0];

            if (href === current) {

                link.classList.add(
                    "active"
                );

            }

        });


    /* =========================================================
       HOME ACTIVE STATE
    ========================================================= */

    const homeButton =
        document.querySelector(
            ".nav-trigger"
        );

    if (
        homeButton &&
        (
            current === "index.html" ||
            current === "" ||
            current === "home-2.html"
        )
    ) {

        homeButton.classList.add(
            "active"
        );

    }


    /* =========================================================
       GENERAL REVEAL ANIMATION
    ========================================================= */

    const revealItems =
    document.querySelectorAll(
        ".reveal, " +
        ".reveal-left, " +
        ".reveal-right, " +
        ".section-header, " +
        ".statistics-heading, " +
        ".reviews-heading, " +
        ".stat-strip, " +
        ".quote-panel, " +
        ".cta-panel"
    );

    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );

        revealItems.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );

    } else {

        revealItems.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    }


    /* =========================================================
       DESIGN PROCESS TIMELINE
    ========================================================= */

    const timeline =
        document.querySelector(
            ".timeline"
        );

    if (timeline) {

        function updateTimelineDirection() {

            const direction =
                root.getAttribute("dir") ||
                "ltr";

            timeline.setAttribute(
                "dir",
                direction
            );

            timeline.classList.toggle(
                "timeline-rtl",
                direction === "rtl"
            );

            timeline.classList.toggle(
                "timeline-ltr",
                direction === "ltr"
            );

        }

        updateTimelineDirection();

        const directionObserver =
            new MutationObserver(
                () => {

                    updateTimelineDirection();

                }
            );

        directionObserver.observe(
            root,
            {
                attributes: true,
                attributeFilter: ["dir"]
            }
        );

    }


    /* =========================================================
       STATISTICS COUNTERS
    ========================================================= */

    const statNumbers =
        document.querySelectorAll(
            ".stat-number[data-target]"
        );

    if (statNumbers.length) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            const number =
                                entry.target;

                            const target =
                                Number(
                                    number.dataset.target ||
                                    0
                                );

                            const prefix =
                                number.dataset.prefix ||
                                "";

                            const suffix =
                                number.dataset.suffix ||
                                "";

                            const duration =
                                1400;

                            const start =
                                performance.now();

                            const updateCounter =
                                now => {

                                    const progress =
                                        Math.min(
                                            (now - start) /
                                            duration,
                                            1
                                        );

                                    const eased =
                                        1 -
                                        Math.pow(
                                            1 - progress,
                                            3
                                        );

                                    number.textContent =
                                        `${prefix}${Math.floor(
                                            target * eased
                                        )}${suffix}`;

                                    if (
                                        progress < 1
                                    ) {

                                        requestAnimationFrame(
                                            updateCounter
                                        );

                                    } else {

                                        number.textContent =
                                            `${prefix}${target}${suffix}`;

                                    }

                                };

                            requestAnimationFrame(
                                updateCounter
                            );

                            counterObserver.unobserve(
                                number
                            );

                        }
                    );

                },
                {
                    threshold: 0.45
                }
            );

        statNumbers.forEach(
            number => {

                counterObserver.observe(
                    number
                );

            }
        );

    }


    /* =========================================================
       CONSULTATION FORM
    ========================================================= */

    document
        .querySelectorAll(
            "[data-consultation-form]"
        )
        .forEach(form => {

            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    const message =
                        form.querySelector(
                            "[data-form-message]"
                        );

                    if (message) {

                        message.textContent =
                            "Thank you. Your enquiry has been received.";

                        message.style.display =
                            "block";

                    }

                    form.reset();

                }
            );

        });


    /* =========================================================
       INITIAL ICONS
    ========================================================= */

    /*
       IMPORTANT FIX:

       First set the correct theme icon.
       Then convert any remaining data-lucide icons only once.

       This avoids:
       Moon -> conversion -> theme update -> conversion

       which was causing the header controls to visually
       change after the page appeared.
    */

    updateThemeIcon();

    icons();


    /* =========================================================
       UNIVERSAL SCROLL REVEAL
       Ensures every page reveals its content as the user scrolls.
       Elements become visible even when a page-specific animation
       was not explicitly wired into the original observer.
    ========================================================= */

    const universalRevealSelector = [
        "main section",
        ".reveal",
        ".reveal-left",
        ".reveal-right",
        ".reveal-item",
        ".reveal-card",
        ".reveal-map",
        ".reveal-faq",
        ".portfolio-reveal",
        ".portfolio-reveal-left",
        ".portfolio-reveal-right",
        ".dp-reveal",
        ".dp-reveal-left",
        ".dp-reveal-right",
        ".scroll-reveal"
    ].join(",");

    function initUniversalReveal() {
        const candidates = Array.from(document.querySelectorAll(universalRevealSelector));
        const seen = new Set();

        candidates.forEach((element) => {
            if (seen.has(element)) return;
            seen.add(element);
            element.classList.add("ink-scroll-item");
        });

        const items = Array.from(document.querySelectorAll(".ink-scroll-item"));
        if (!items.length) return;

        const show = (element) => {
            element.classList.add("ink-scroll-visible");
            element.classList.add("is-visible");
            element.classList.add("scroll-revealed");
        };

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        show(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.06, rootMargin: "0px 0px -25px 0px" });

            items.forEach((item) => observer.observe(item));
        } else {
            items.forEach(show);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initUniversalReveal, { once: true });
    } else {
        initUniversalReveal();
    }

})();



/* =========================================================
   THE ART OF THE READING ROOM
   SCROLL ANIMATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const readingRoom =
            document.querySelector(
                ".reading-room-section"
            );

        if (!readingRoom) {
            return;
        }

        const observer =
            new IntersectionObserver(
                function (
                    entries,
                    observer
                ) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.18,
                    rootMargin:
                        "0px 0px -80px 0px"
                }
            );

        observer.observe(
            readingRoom
        );

    }
);



/* =========================================================
   HOME 2 - INDIVIDUAL ELEMENT REVEAL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const items =
            document.querySelectorAll(
                ".reading-room-card, " +
                ".home2-reviews .section-header, " +
                ".home2-reviews .review-editorial-item, " +
                ".home2-quote-section .quote-panel, " +
                ".home2-cta"
            );

        if (!items.length) {
            return;
        }

        function revealItems() {

            const triggerPoint =
                window.innerHeight * 0.78;

            items.forEach(
                item => {

                    if (
                        item.classList.contains(
                            "scroll-revealed"
                        )
                    ) {
                        return;
                    }

                    const rect =
                        item.getBoundingClientRect();

                    if (
                        rect.top <= triggerPoint
                    ) {

                        item.classList.add(
                            "scroll-revealed"
                        );

                    }

                }
            );

        }

        window.addEventListener(
            "scroll",
            revealItems,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            revealItems
        );

        revealItems();

    }
);



/* =========================================================
   READING ROOM INDIVIDUAL REVEAL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const readingItems =
            document.querySelectorAll(
                ".reading-room-heading, " +
                ".reading-room-card"
            );

        if (!readingItems.length) {
            return;
        }

        function revealReadingRoom() {

            const triggerPoint =
                window.innerHeight * 0.78;

            readingItems.forEach(
                item => {

                    if (
                        item.classList.contains(
                            "scroll-revealed"
                        )
                    ) {
                        return;
                    }

                    const rect =
                        item.getBoundingClientRect();

                    if (
                        rect.top <= triggerPoint
                    ) {

                        item.classList.add(
                            "scroll-revealed"
                        );

                    }

                }
            );

        }

        window.addEventListener(
            "scroll",
            revealReadingRoom,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            revealReadingRoom
        );

        revealReadingRoom();

    }
);


/* =========================================================
   INKDEN — PORTFOLIO COMPLETE SCROLL REVEAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const portfolioItems = document.querySelectorAll(
        ".portfolio-reveal, " +
        ".portfolio-reveal-left, " +
        ".portfolio-reveal-right, " +
        ".featured-project-image, " +
        ".featured-project-content, " +
        ".collection-heading, " +
        ".collection-card, " +
        ".transformation-card, " +
        ".details-content, " +
        ".details-image, " +
        ".detail-feature, " +
        ".portfolio-cta-inner"
    );

    if (!portfolioItems.length) {
        return;
    }


    /* Reduced motion */
    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        portfolioItems.forEach(item => {
            item.classList.add("is-visible");
        });

        return;
    }


    /* Intersection Observer */
    if ("IntersectionObserver" in window) {

        const portfolioObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -70px 0px"
                }
            );


        portfolioItems.forEach(item => {

            portfolioObserver.observe(item);

        });

    } else {

        /* Fallback */
        portfolioItems.forEach(item => {
            item.classList.add("is-visible");
        });

    }

});



/* =========================================================
   INKDEN DESIGN PROCESS
   SCROLL REVEAL + STAGGER + IMAGE HOVER
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const designProcessSelectors = [
            ".dp-reveal",
            ".dp-reveal-left",
            ".dp-reveal-right",
            ".dp-hero-art",
            ".dp-philosophy-image",
            ".dp-concept-image",
            ".dp-reality-image",
            ".dp-final-image",
            ".dp-step",
            ".dp-principles",
            ".dp-reality-list",
            ".dp-deliverable",
            ".dp-cta"
        ];

        const designProcessItems =
            document.querySelectorAll(
                designProcessSelectors.join(", ")
            );


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {

            designProcessItems.forEach(
                item => {

                    item.classList.add(
                        "is-visible"
                    );

                }
            );

            return;

        }


        /* =====================================================
           SCROLL REVEAL
        ===================================================== */

        if (
            designProcessItems.length &&
            "IntersectionObserver" in window
        ) {

            const designProcessObserver =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(
                            entry => {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                designProcessObserver.unobserve(
                                    entry.target
                                );

                            }
                        );

                    },
                    {
                        threshold: 0.12,
                        rootMargin:
                            "0px 0px -70px 0px"
                    }
                );

            designProcessItems.forEach(
                item => {

                    designProcessObserver.observe(
                        item
                    );

                }
            );

        } else {

            designProcessItems.forEach(
                item => {

                    item.classList.add(
                        "is-visible"
                    );

                }
            );

        }


        /* =====================================================
           8 STAGE STAGGER
        ===================================================== */

        const processSteps =
            document.querySelectorAll(
                ".dp-step"
            );

        processSteps.forEach(
            (step, index) => {

                step.style.transitionDelay =
                    `${index * 0.08}s`;

            }
        );


        /* =====================================================
           DELIVERABLE CARD STAGGER
        ===================================================== */

        const deliverables =
            document.querySelectorAll(
                ".dp-deliverable"
            );

        deliverables.forEach(
            (card, index) => {

                card.style.transitionDelay =
                    `${index * 0.10}s`;

            }
        );


        /* =====================================================
           DESIGN PRINCIPLE CARD STAGGER
        ===================================================== */

        const principles =
            document.querySelectorAll(
                ".dp-principle-card, .dp-principle"
            );

        principles.forEach(
            (card, index) => {

                card.style.transitionDelay =
                    `${index * 0.11}s`;

            }
        );


        /* =====================================================
           REALITY CARD STAGGER
        ===================================================== */

        const realityCards =
            document.querySelectorAll(
                ".dp-reality-card"
            );

        realityCards.forEach(
            (card, index) => {

                card.style.transitionDelay =
                    `${index * 0.12}s`;

            }
        );


        /* =====================================================
           FLOW ITEMS STAGGER
        ===================================================== */

        const flowItems =
            document.querySelectorAll(
                ".dp-flow-item"
            );

        flowItems.forEach(
            (item, index) => {

                item.style.transitionDelay =
                    `${index * 0.10}s`;

            }
        );


        /* =====================================================
           IMAGE HOVER MOVEMENT
        ===================================================== */

        const processImages =
            document.querySelectorAll(
                ".dp-art-frame, " +
                ".dp-sticky-image-frame, " +
                ".dp-image-frame, " +
                ".dp-reality-image, " +
                ".dp-final-frame"
            );

        processImages.forEach(
            frame => {

                const image =
                    frame.querySelector(
                        "img"
                    );

                if (!image) {
                    return;
                }

                frame.addEventListener(
                    "mousemove",
                    event => {

                        if (
                            window.innerWidth <= 768
                        ) {
                            return;
                        }

                        const rect =
                            frame.getBoundingClientRect();

                        const x =
                            (event.clientX -
                                rect.left) /
                                rect.width -
                            0.5;

                        const y =
                            (event.clientY -
                                rect.top) /
                                rect.height -
                            0.5;

                        image.style.transform =
                            `scale(1.035) translate(
                                ${x * 4}px,
                                ${y * 4}px
                            )`;

                    }
                );

                frame.addEventListener(
                    "mouseleave",
                    () => {

                        image.style.transform =
                            "scale(1) translate(0, 0)";

                    }
                );

            }
        );


        /* =====================================================
           STAGE NUMBER HOVER
        ===================================================== */

        const stageMarkers =
            document.querySelectorAll(
                ".dp-step-marker"
            );

        stageMarkers.forEach(
            marker => {

                marker.addEventListener(
                    "mouseenter",
                    () => {

                        marker.classList.add(
                            "stage-hover"
                        );

                    }
                );

                marker.addEventListener(
                    "mouseleave",
                    () => {

                        marker.classList.remove(
                            "stage-hover"
                        );

                    }
                );

            }
        );


        /* =====================================================
           CTA REVEAL
        ===================================================== */

        const processCta =
            document.querySelector(
                ".dp-cta"
            );

        if (
            processCta &&
            "IntersectionObserver" in window
        ) {

            const ctaObserver =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(
                            entry => {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                ctaObserver.unobserve(
                                    entry.target
                                );

                            }
                        );

                    },
                    {
                        threshold: 0.2
                    }
                );

            ctaObserver.observe(
                processCta
            );

        }


        /* =====================================================
           HERO IMAGE LOAD EFFECT
        ===================================================== */

        const processHeroImage =
            document.querySelector(
                ".dp-hero-image"
            );

        if (processHeroImage) {

            processHeroImage.classList.add(
                "image-ready"
            );

        }


        /* =====================================================
           DESIGN PROCESS SECTION OBSERVER
        ===================================================== */

        const processSections =
            document.querySelectorAll(
                ".dp-philosophy, " +
                ".dp-journey, " +
                ".dp-concept, " +
                ".dp-reality, " +
                ".dp-final, " +
                ".dp-deliverables, " +
                ".dp-cta-section"
            );

        if (
            processSections.length &&
            "IntersectionObserver" in window
        ) {

            const sectionObserver =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(
                            entry => {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }

                                entry.target.classList.add(
                                    "section-visible"
                                );

                                sectionObserver.unobserve(
                                    entry.target
                                );

                            }
                        );

                    },
                    {
                        threshold: 0.08,
                        rootMargin:
                            "0px 0px -60px 0px"
                    }
                );

            processSections.forEach(
                section => {

                    sectionObserver.observe(
                        section
                    );

                }
            );

        }


        /* =====================================================
           BUTTON / CARD HOVER
        ===================================================== */

        const processButtons =
            document.querySelectorAll(
                ".dp-hero .btn, " +
                ".dp-cta .btn, " +
                ".dp-text-link, " +
                ".dp-explore-btn"
            );

        processButtons.forEach(
            button => {

                button.addEventListener(
                    "mouseenter",
                    () => {

                        button.classList.add(
                            "process-button-hover"
                        );

                    }
                );

                button.addEventListener(
                    "mouseleave",
                    () => {

                        button.classList.remove(
                            "process-button-hover"
                        );

                    }
                );

            }
        );

    }
);



/* =========================================================
   DESIGN PROCESS HERO ANIMATION
   CORRECT SELECTORS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const hero =
            document.querySelector(
                ".dp-hero"
            );

        if (!hero) {
            return;
        }


        /* =====================================================
           HERO ELEMENTS
        ===================================================== */

        const kicker =
            hero.querySelector(
                ".dp-kicker"
            );

        const heading =
            hero.querySelector(
                "h1"
            );

        const paragraph =
            hero.querySelector(
                "p"
            );

        const button =
            hero.querySelector(
                ".dp-hero-btn"
            );

        const heroImage =
            hero.querySelector(
                ".dp-hero-image"
            );

        const heroLines =
            hero.querySelector(
                ".dp-hero-lines"
            );


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        if (reducedMotion) {

            [
                kicker,
                heading,
                paragraph,
                button
            ].forEach(
                element => {

                    if (!element) {
                        return;
                    }

                    element.style.opacity =
                        "1";

                    element.style.transform =
                        "none";

                    element.style.filter =
                        "none";

                }
            );

            return;

        }


        /* =====================================================
           HERO INITIAL STATE
        ===================================================== */

        const heroItems = [
            {
                element: kicker,
                delay: 150
            },
            {
                element: heading,
                delay: 320
            },
            {
                element: paragraph,
                delay: 520
            },
            {
                element: button,
                delay: 720
            }
        ];


        heroItems.forEach(
            item => {

                if (!item.element) {
                    return;
                }

                item.element.style.opacity =
                    "0";

                item.element.style.transform =
                    "translateY(35px)";

                item.element.style.filter =
                    "blur(8px)";

                item.element.style.transition =
                    "opacity .9s ease, " +
                    "transform .9s cubic-bezier(.22,1,.36,1), " +
                    "filter .9s ease";

            }
        );


        /* =====================================================
           HERO IMAGE
        ===================================================== */

        if (heroImage) {

            heroImage.style.opacity =
                "0";

            heroImage.style.transform =
                "scale(1.08)";

            heroImage.style.transition =
                "opacity 1.2s ease, " +
                "transform 1.8s cubic-bezier(.22,1,.36,1)";

            requestAnimationFrame(
                () => {

                    setTimeout(
                        () => {

                            heroImage.style.opacity =
                                "1";

                            heroImage.style.transform =
                                "scale(1.03)";

                        },
                        100
                    );

                }
            );

        }


        /* =====================================================
           HERO LINES
        ===================================================== */

        if (heroLines) {

            heroLines.style.opacity =
                "0";

            heroLines.style.transform =
                "scale(.96)";

            heroLines.style.transition =
                "opacity 1.4s ease, " +
                "transform 1.5s ease";

            setTimeout(
                () => {

                    heroLines.style.opacity =
                        "1";

                    heroLines.style.transform =
                        "scale(1)";

                },
                250
            );

        }


        /* =====================================================
           TEXT STAGGER
        ===================================================== */

        heroItems.forEach(
            item => {

                if (!item.element) {
                    return;
                }

                setTimeout(
                    () => {

                        item.element.style.opacity =
                            "1";

                        item.element.style.transform =
                            "translateY(0)";

                        item.element.style.filter =
                            "blur(0)";

                    },
                    item.delay
                );

            }
        );


        /* =====================================================
           GOLD HEADING ANIMATION
        ===================================================== */

        if (heading) {

            const emphasis =
                heading.querySelector(
                    "em"
                );

            if (emphasis) {

                emphasis.style.display =
                    "inline-block";

                emphasis.style.opacity =
                    "0";

                emphasis.style.transform =
                    "translateY(25px)";

                emphasis.style.filter =
                    "blur(6px)";

                emphasis.style.transition =
                    "opacity 1s ease, " +
                    "transform 1s cubic-bezier(.22,1,.36,1), " +
                    "filter 1s ease";

                setTimeout(
                    () => {

                        emphasis.style.opacity =
                            "1";

                        emphasis.style.transform =
                            "translateY(0)";

                        emphasis.style.filter =
                            "blur(0)";

                    },
                    600
                );

            }

        }


        /* =====================================================
           HERO BUTTON HOVER
        ===================================================== */

        if (button) {

            button.addEventListener(
                "mouseenter",
                () => {

                    button.style.transform =
                        "translateY(-4px) scale(1.03)";

                    button.style.boxShadow =
                        "0 12px 28px rgba(154,118,47,.28)";

                }
            );

            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "translateY(0) scale(1)";

                    button.style.boxShadow =
                        "none";

                }
            );

        }


        /* =====================================================
           HERO MOUSE PARALLAX
        ===================================================== */

        if (heroImage) {

            hero.addEventListener(
                "mousemove",
                event => {

                    if (
                        window.innerWidth <= 768
                    ) {
                        return;
                    }

                    const rect =
                        hero.getBoundingClientRect();

                    const x =
                        (event.clientX -
                            rect.left) /
                            rect.width -
                        0.5;

                    const y =
                        (event.clientY -
                            rect.top) /
                            rect.height -
                        0.5;

                    heroImage.style.transform =
                        `scale(1.05) translate(
                            ${x * 5}px,
                            ${y * 5}px
                        )`;

                }
            );

            hero.addEventListener(
                "mouseleave",
                () => {

                    heroImage.style.transform =
                        "scale(1.03)";

                }
            );

        }


        /* =====================================================
           HERO IMAGE CLICK / TOUCH SAFETY
        ===================================================== */

        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth <= 768
                ) {

                    if (heroImage) {

                        heroImage.style.transform =
                            "scale(1.03)";

                    }

                }

            }
        );

    }
);



/* =========================================================
   CONTACT PAGE SCROLL REVEAL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const contactElements =
            document.querySelectorAll(
                ".contact-touch .reveal-item, " +
                ".contact-touch .reveal-card, " +
                ".contact-form-section .reveal-left, " +
                ".contact-form-section .reveal-right, " +
                ".contact-form-section .reveal-item, " +
                ".contact-map-section .reveal-item, " +
                ".contact-map-section .reveal-map, " +
                ".contact-faq .reveal-item, " +
                ".contact-faq .reveal-faq, " +
                ".contact-cta .reveal-left, " +
                ".contact-cta .reveal-right"
            );

        if (!contactElements.length) {
            return;
        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        if (reducedMotion) {

            contactElements.forEach(
                element => {

                    element.classList.add(
                        "is-visible"
                    );

                }
            );

            return;
        }


        /* =====================================================
           CONTACT PAGE OBSERVER
        ===================================================== */

        if (
            "IntersectionObserver" in window
        ) {

            const contactObserver =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(
                            entry => {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                contactObserver.unobserve(
                                    entry.target
                                );

                            }
                        );

                    },
                    {
                        threshold: 0.12,
                        rootMargin:
                            "0px 0px -70px 0px"
                    }
                );

            contactElements.forEach(
                element => {

                    contactObserver.observe(
                        element
                    );

                }
            );

        } else {

            contactElements.forEach(
                element => {

                    element.classList.add(
                        "is-visible"
                    );

                }
            );

        }


        /* =====================================================
           CONTACT CARD STAGGER
        ===================================================== */

        const cards =
            document.querySelectorAll(
                ".contact-touch-card"
            );

        cards.forEach(
            (card, index) => {

                card.style.setProperty(
                    "--card-delay",
                    `${index * 100}ms`
                );

            }
        );


        /* =====================================================
           FAQ STAGGER
        ===================================================== */

        const faqItems =
            document.querySelectorAll(
                ".contact-faq .faq-item"
            );

        faqItems.forEach(
            (item, index) => {

                item.style.setProperty(
                    "--faq-delay",
                    `${index * 90}ms`
                );

            }
        );

    }
);

/* =========================================================
   FINAL LUCIDE RENDER SAFETY
   ========================================================= */
window.addEventListener("DOMContentLoaded", () => {
    if (typeof icons === "function") icons();
});
window.addEventListener("load", () => {
    if (typeof icons === "function") icons();
});
/* =========================================================
   HOME 2 — SIGNATURE DETAILS + SIGNATURE CRAFT
   SCROLL REVEAL ANIMATIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const signatureItems = document.querySelectorAll(
        ".home2-signature-details-heading, " +
        ".home2-details-heading, " +
        ".home2-details-heading + .feature-grid .feature-card"
    );

    if (!signatureItems.length) return;

    const revealSignatureItem = (element) => {
        element.classList.add("scroll-revealed");
    };

    /* Reduced motion */
    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        signatureItems.forEach(revealSignatureItem);
        return;
    }

    /* Intersection Observer */
    if ("IntersectionObserver" in window) {

        const signatureObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        revealSignatureItem(
                            entry.target
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.16,
                    rootMargin: "0px 0px -8% 0px"
                }
            );

        signatureItems.forEach(
            (item, index) => {

                /* Stagger Signature Craft cards */
                if (
                    item.classList.contains(
                        "feature-card"
                    )
                ) {
                    item.style.transitionDelay =
                        `${index * 0.12}s`;
                }

                signatureObserver.observe(
                    item
                );

            }
        );

    } else {

        signatureItems.forEach(
            revealSignatureItem
        );

    }

});
document.querySelectorAll('.footer-contact a, .footer-contact span').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.15)';
        }
    });

    item.addEventListener('mouseleave', () => {
        const icon = item.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(
        ".reveal-up, .reveal-left, .reveal-right"
    );

    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

});