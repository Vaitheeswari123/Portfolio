document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       CUSTOM CURSOR
       ========================================================================== */
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.querySelector('.custom-cursor-glow');
    
    if (cursor && cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            // Subtle lag effect for the outer glow ring
            cursorGlow.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 150, fill: 'forwards' });
        });
        
        // Scale and change color on interactive items hover
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .room-selector-card, .tab-btn, .hamburger-menu');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                cursorGlow.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                cursorGlow.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       MOBILE NAVIGATION HAMBURGER MECHANICS
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       SCROLL EFFECTS: STICKY HEADER & ACTIVE NAVIGATION LINKS
       ========================================================================== */
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Sticky Header scroll styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       CASE STUDY MODAL SYSTEM
       ========================================================================== */
    const openModalBtn = document.getElementById('open-case-study');
    const modalBackdrop = document.getElementById('case-study-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    if (openModalBtn && modalBackdrop && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modalBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        });
        
        const closeModal = () => {
            modalBackdrop.classList.remove('active');
            document.body.style.overflow = 'auto'; // Unlock scroll
        };
        
        closeModalBtn.addEventListener('click', closeModal);
        
        // Close on clicking backdrop
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });
        
        // Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /* ==========================================================================
       CASE STUDY SCROLL NAVIGATION & INDEX
       ========================================================================== */
    const indexLinks = document.querySelectorAll('.cs-index-link');
    const scrollSections = document.querySelectorAll('.cs-scroll-section');
    const scrollContainer = document.querySelector('.case-study-scroll-content');
    
    if (indexLinks.length > 0 && scrollContainer) {
        indexLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Scroll to section inside the scrollable content container
                    scrollContainer.scrollTo({
                        top: targetSection.offsetTop - 20,
                        behavior: 'smooth'
                    });
                    
                    // Update active state immediately
                    indexLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Set up scroll spy observer
        const observerOptions = {
            root: scrollContainer,
            rootMargin: '-10% 0px -70% 0px', // Trigger when section is in the middle of viewport
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.cs-index-link[href="#${id}"]`);
                    
                    if (activeLink) {
                        indexLinks.forEach(l => l.classList.remove('active'));
                        activeLink.classList.add('active');
                        
                        // Mobile auto-scroll horizontal index to keep current link visible
                        const sidebar = document.querySelector('.case-study-sidebar');
                        if (sidebar && window.innerWidth <= 991) {
                            const activeLinkLeft = activeLink.offsetLeft;
                            const activeLinkWidth = activeLink.offsetWidth;
                            const sidebarScrollLeft = sidebar.scrollLeft;
                            const sidebarWidth = sidebar.offsetWidth;
                            
                            if (activeLinkLeft < sidebarScrollLeft || (activeLinkLeft + activeLinkWidth) > (sidebarScrollLeft + sidebarWidth)) {
                                sidebar.scrollTo({
                                    left: activeLinkLeft - 20,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    }
                }
            });
        }, observerOptions);

        scrollSections.forEach(section => observer.observe(section));
    }



    /* ==========================================================================
       CONTACT FORM SUBMISSION FEEDBACK
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show feedback animation on submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = '<span class="btn-text">Sending Message...</span> <span class="btn-icon"><i class="fa-solid fa-spinner fa-spin"></i></span>';
            
            // Simulated submission delay
            setTimeout(() => {
                submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span> <span class="btn-icon"><i class="fa-solid fa-circle-check"></i></span>';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)'; // Successful Green Glow
                
                // Reset Form
                contactForm.reset();
                
                // Reset button back to original state after 3 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '';
                    submitBtn.innerHTML = originalText;
                }, 3000);
            }, 1800);
        });
    }

    /* ==========================================================================
       CASE STUDY SLIDER/CAROUSEL CONTROLLER
       ========================================================================== */
    const sliderImages = document.querySelectorAll('#case-study-slider .case-study-img');
    const csPrevBtn = document.getElementById('case-study-prev');
    const csNextBtn = document.getElementById('case-study-next');
    const counterText = document.getElementById('case-study-counter');
    const titleText = document.getElementById('case-study-title');
    let currentSlide = 0;

    if (sliderImages.length > 0 && csPrevBtn && csNextBtn && counterText) {
        const updateSlider = () => {
            sliderImages.forEach((img, idx) => {
                img.classList.remove('active');
                if (idx === currentSlide) {
                    img.classList.add('active');
                }
            });
            counterText.textContent = `${currentSlide + 1} / ${sliderImages.length}`;
            if (titleText && sliderImages[currentSlide]) {
                titleText.textContent = sliderImages[currentSlide].getAttribute('alt');
            }
        };

        csPrevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + sliderImages.length) % sliderImages.length;
            updateSlider();
        });

        csNextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % sliderImages.length;
            updateSlider();
        });
    }
});
