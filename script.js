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
       CASE STUDY TABS FUNCTIONALITY
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active states
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Set active states
            btn.classList.add('active');
            const targetPane = document.getElementById(`tab-${targetTab}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       LIVE PROTOTYPE: ROOM SELECTOR LOGIC
       ========================================================================== */
    const roomCards = document.querySelectorAll('.room-selector-card');
    const selectedRoomName = document.getElementById('selected-room-name');
    const selectedRoomPrice = document.getElementById('selected-room-price');
    
    if (roomCards.length > 0 && selectedRoomName && selectedRoomPrice) {
        roomCards.forEach(card => {
            card.addEventListener('click', () => {
                // Clear previous active states
                roomCards.forEach(c => c.classList.remove('active'));
                
                // Add active state to clicked
                card.classList.add('active');
                
                // Get data variables
                const roomName = card.getAttribute('data-room');
                const roomPrice = card.getAttribute('data-price');
                
                // Update text elements
                selectedRoomName.textContent = roomName;
                selectedRoomPrice.textContent = `$${roomPrice}.00/hr`;
            });
        });
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
});
