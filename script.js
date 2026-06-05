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
       LIVE PROTOTYPE: MULTI-SCREEN PHONE SIMULATOR
       ========================================================================== */
    const simScreens = {
        splash: document.getElementById('sim-screen-splash'),
        login: document.getElementById('sim-screen-login'),
        otp: document.getElementById('sim-screen-otp'),
        list: document.getElementById('sim-screen-list'),
        detail: document.getElementById('sim-screen-detail'),
        success: document.getElementById('sim-screen-success')
    };

    const checkItems = {
        splash: document.getElementById('chk-splash'),
        login: document.getElementById('chk-login'),
        otp: document.getElementById('chk-otp'),
        list: document.getElementById('chk-list'),
        detail: document.getElementById('chk-detail')
    };

    const phoneInput = document.getElementById('sim-login-phone');
    const otpTimerText = document.getElementById('sim-otp-timer-text');
    let otpInterval = null;
    let otpTimerValue = 59;

    function startOtpTimer() {
        clearInterval(otpInterval);
        otpTimerValue = 59;
        otpTimerText.textContent = `00:59s`;
        
        otpInterval = setInterval(() => {
            otpTimerValue--;
            if (otpTimerValue <= 0) {
                clearInterval(otpInterval);
                otpTimerText.textContent = "Expired";
            } else {
                const sec = otpTimerValue < 10 ? `0${otpTimerValue}` : otpTimerValue;
                otpTimerText.textContent = `00:${sec}s`;
            }
        }, 1000);
    }

    function stopOtpTimer() {
        clearInterval(otpInterval);
    }

    function switchSimScreen(targetScreenKey) {
        // Toggle visibility on all screens
        Object.keys(simScreens).forEach(key => {
            if (simScreens[key]) {
                simScreens[key].classList.remove('active');
            }
        });

        const activeScreen = simScreens[targetScreenKey];
        if (activeScreen) {
            activeScreen.classList.add('active');
        }

        // Manage Timer
        if (targetScreenKey === 'otp') {
            startOtpTimer();
        } else {
            stopOtpTimer();
        }

        // Manage Checklist states
        const keys = ['splash', 'login', 'otp', 'list', 'detail'];
        const targetIndex = keys.indexOf(targetScreenKey);

        keys.forEach((key, index) => {
            const chk = checkItems[key];
            if (chk) {
                chk.classList.remove('active', 'completed');
                
                if (targetScreenKey === 'success') {
                    chk.classList.add('completed');
                } else if (index < targetIndex) {
                    chk.classList.add('completed');
                } else if (index === targetIndex) {
                    chk.classList.add('active');
                }
            }
        });
    }

    // 1. Splash Screen Action
    if (simScreens.splash) {
        simScreens.splash.addEventListener('click', () => {
            switchSimScreen('login');
            // Auto fill phone number with delay for natural typing feel
            if (phoneInput) {
                phoneInput.value = '';
                let index = 0;
                const number = '9876543210';
                const typeInterval = setInterval(() => {
                    if (index < number.length) {
                        phoneInput.value += number[index];
                        index++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 80);
            }
        });
    }

    // 2. Login Page Action
    const loginContinueBtn = document.getElementById('sim-login-continue-btn');
    if (loginContinueBtn) {
        loginContinueBtn.addEventListener('click', () => {
            if (phoneInput && !phoneInput.value) {
                phoneInput.value = '9876543210';
            }
            switchSimScreen('otp');
        });
    }

    // 3. OTP Action
    const otpVerifyBtn = document.getElementById('sim-otp-verify-btn');
    const otpCancelBtn = document.getElementById('sim-otp-cancel-btn');
    const otpBackBtn = document.getElementById('sim-otp-back-btn');

    if (otpVerifyBtn) {
        otpVerifyBtn.addEventListener('click', () => {
            switchSimScreen('list');
        });
    }

    if (otpCancelBtn) {
        otpCancelBtn.addEventListener('click', () => {
            switchSimScreen('login');
        });
    }

    if (otpBackBtn) {
        otpBackBtn.addEventListener('click', () => {
            switchSimScreen('login');
        });
    }

    // Auto-focus logic for OTP inputs
    const otpDigits = document.querySelectorAll('.otp-digit');
    otpDigits.forEach((digitInput, idx) => {
        digitInput.addEventListener('keyup', (e) => {
            if (e.target.value.length === 1 && idx < otpDigits.length - 1) {
                otpDigits[idx + 1].focus();
            }
        });
    });

    // 4. Listing Action
    const chennaiCard = document.getElementById('sim-card-chennai');
    const shootplotCard = document.getElementById('sim-card-shootplot');

    if (chennaiCard) {
        chennaiCard.addEventListener('click', () => {
            switchSimScreen('detail');
        });
    }

    if (shootplotCard) {
        shootplotCard.addEventListener('click', () => {
            alert("Prototype note: 'Shoot Plot.com' layout is locked for this demo. Please click 'Chennai Podcast' to continue the booking reservation flow!");
        });
    }

    // 5. Reservation / Detail Actions
    const reserveDetailBackBtn = document.getElementById('sim-detail-back-btn');
    const reserveSubmitBtn = document.getElementById('sim-reserve-submit-btn');

    if (reserveDetailBackBtn) {
        reserveDetailBackBtn.addEventListener('click', () => {
            switchSimScreen('list');
        });
    }

    if (reserveSubmitBtn) {
        reserveSubmitBtn.addEventListener('click', () => {
            reserveSubmitBtn.disabled = true;
            const originalText = reserveSubmitBtn.textContent;
            reserveSubmitBtn.textContent = 'Reserving slot...';
            
            setTimeout(() => {
                reserveSubmitBtn.disabled = false;
                reserveSubmitBtn.textContent = originalText;
                switchSimScreen('success');
            }, 1200);
        });
    }

    // 6. Success Done Action
    const successDoneBtn = document.getElementById('success-done-btn');
    if (successDoneBtn) {
        successDoneBtn.addEventListener('click', () => {
            switchSimScreen('splash');
        });
    }

    // Main Reset Button
    const resetSimBtn = document.getElementById('reset-sim-btn');
    if (resetSimBtn) {
        resetSimBtn.addEventListener('click', () => {
            switchSimScreen('splash');
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

    /* ==========================================================================
       CASE STUDY SLIDER/CAROUSEL CONTROLLER
       ========================================================================== */
    const sliderImages = document.querySelectorAll('#case-study-slider .case-study-img');
    const csPrevBtn = document.getElementById('case-study-prev');
    const csNextBtn = document.getElementById('case-study-next');
    const counterText = document.getElementById('case-study-counter');
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
