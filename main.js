// Service Slider Functionality
function initServiceSlider() {
    const track = document.querySelector('.services-track');
    const cards = document.querySelectorAll('.service-card');
    const servicesSlider = document.querySelector('.services-slider'); // The viewport

    if (!cards || cards.length === 0) {
        console.error("No service cards found for the slider.");
        return;
    }
    if (!servicesSlider) {
        console.error("Slider viewport (.services-slider) not found.");
        return;
    }

    let cardElement, trackStyle, gapValue, singleCardWidth, viewportWidth;
    let numVisibleCards, scrollStepAmount, maxScrollableIndex, maxScrollableOffset;
    let currentPosition = 0;
    let scrollInterval;
    let isHovering = false;

    function calculateDimensions() {
        cardElement = cards[0];
        trackStyle = window.getComputedStyle(track);
        
        // For a horizontal flex slider, the gap between items along the main axis is column-gap
        let rawGap = trackStyle.columnGap;
        if (rawGap === 'normal') { // 'normal' can't be parsed to a number
            // Fallback: try to get it from 'gap' if it's a single value, or assume 0 or a known default.
            // This might happen if 'gap' is set but 'column-gap' isn't explicitly.
            // For simplicity, if 'normal', you might need a hardcoded fallback if critical.
            // console.warn("columnGap is 'normal'. Parsing 'gap' property instead or using fallback.");
            rawGap = trackStyle.gap.split(' ')[0]; // Try first part of 'gap'
        }
        gapValue = parseFloat(rawGap);

        if (isNaN(gapValue)) {
            console.warn("Could not parse columnGap. Defaulting to 0. Check CSS 'gap' or 'column-gap' on .services-track.");
            gapValue = 0; // Fallback to 0 if parsing fails
        }

        singleCardWidth = cardElement.offsetWidth;
        viewportWidth = servicesSlider.offsetWidth;

        if (singleCardWidth + gapValue <= 0) { // Avoid division by zero or negative
            numVisibleCards = 1; // Fallback
        } else {
            // Calculate how many cards are effectively visible
            numVisibleCards = Math.round((viewportWidth + gapValue) / (singleCardWidth + gapValue));
        }
        if (numVisibleCards <= 0) numVisibleCards = 1; // Ensure at least 1

        scrollStepAmount = singleCardWidth + gapValue;
        maxScrollableIndex = Math.max(0, cards.length - numVisibleCards);
        maxScrollableOffset = maxScrollableIndex * scrollStepAmount;
    }

    function updateSliderPosition(animate = true) {
        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease';
        }
        track.style.transform = `translateX(-${currentPosition}px)`;
        if (!animate) {
            // Force reflow to apply the instant change, then re-enable transition for next user/auto interaction
            void track.offsetWidth; 
        }
    }
    
    function moveToNextCard() {
        if (isHovering) return;
        
        currentPosition += scrollStepAmount;
        
        if (currentPosition > maxScrollableOffset) {
            // If currentPosition slightly overshoots due to floating point, but should be maxScrollableOffset before reset
            if (currentPosition < maxScrollableOffset + scrollStepAmount) {
                 // This means it was at maxScrollableOffset and tried to go one step further
                 currentPosition = 0; // Loop to start
            } else {
                // This case should ideally not be reached if logic is sound.
                // It implies currentPosition jumped significantly beyond max. Snap to 0.
                currentPosition = 0;
            }
        }
        // Ensure currentPosition is not some weird intermediate float if not looping
        // currentPosition = Math.round(currentPosition / scrollStepAmount) * scrollStepAmount;
        // currentPosition = Math.min(currentPosition, maxScrollableOffset);


        updateSliderPosition();
    }
    
    function startAutoScroll() {
        clearInterval(scrollInterval); 
        scrollInterval = setInterval(moveToNextCard, 3000);
    }
    
    function handleMouseEnter() {
        isHovering = true;
        clearInterval(scrollInterval);
    }
    
    function handleMouseLeave() {
        isHovering = false;
        startAutoScroll();
    }
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
    });
    
    track.addEventListener('transitionend', () => {
        // This listener is primarily to handle cleanup or states after an animation.
        // The original issue: an *instant* reset if currentPosition >= maxScrollableOffset.
        // My previous fix: change to currentPosition > maxScrollableOffset.
        // This allows the slider to rest at maxScrollableOffset.
        // moveToNextCard will then handle the animated loop from that state.
        // So, this transitionend block might not need to do any reset if moveToNextCard is robust.
        
        // If currentPosition after a transition is somehow in an "invalid" state that
        // moveToNextCard's logic didn't already catch and animate from, this could be a fallback.
        // However, with the revised moveToNextCard, this condition should ideally not be met
        // in a way that requires an *instant* jump different from what moveToNextCard planned.
        if (currentPosition > maxScrollableOffset && currentPosition !== 0) {
            // This implies we are past the end and not already reset to 0 by moveToNextCard
            // This could be a safeguard, but ideally moveToNextCard prevents this state
            // or animates from it.
            // console.warn("TransitionEnd: currentPosition is beyond max and not 0. Snapping to 0.");
            // currentPosition = 0;
            // updateSliderPosition(false); // Instant jump
        }
    });
    
    // Initial Setup
    calculateDimensions();
    updateSliderPosition(false); // Set initial position without animation
    startAutoScroll();
    
    window.addEventListener('resize', function() {
        // Stop existing autoscroll during resize operations
        clearInterval(scrollInterval);

        calculateDimensions(); // Recalculate all dynamic values

        // Adjust currentPosition: if it's now beyond the new max, snap it.
        if (currentPosition > maxScrollableOffset) {
            currentPosition = maxScrollableOffset;
        }
        // Optional: snap to the nearest valid scroll step
        currentPosition = Math.round(currentPosition / scrollStepAmount) * scrollStepAmount;
        currentPosition = Math.min(currentPosition, maxScrollableOffset); // Ensure it's not over
        currentPosition = Math.max(0, currentPosition); // Ensure it's not negative

        updateSliderPosition(false); // Apply resize changes instantly

        // Restart autoscroll if not hovering
        if (!isHovering) {
            startAutoScroll();
        }
    });
}

// Ensure this runs after the DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     initServiceSlider(); // This is already called in your main.js
// });

document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const logo = document.querySelector('.logo img');
    const navLinks = document.querySelectorAll('.nav-link');
    const phoneIcon = document.querySelector('.phone i');
    const phoneText = document.querySelector('.phone span');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > window.innerHeight * 0.3) {
            navbar.classList.add('scrolled');
            logo.style.filter = 'brightness(1)';
            navLinks.forEach(link => link.style.color = 'black');
            phoneIcon.style.color = 'black';
            phoneText.style.color = 'black';
        } else {
            navbar.classList.remove('scrolled');
            logo.style.filter = 'brightness(1)';
            navLinks.forEach(link => link.style.color = 'white');
            phoneIcon.style.color = 'white';
            phoneText.style.color = 'white';
        }
    });
    
    // Main slider functionality
    const slides = document.querySelectorAll('.slide');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentSlide = 0;
    let slideInterval;

    function forceAnimationRestart(element) {
        void element.offsetWidth; // Trigger reflow
        element.style.animation = 'none';
        void element.offsetWidth; // Trigger reflow again
        element.style.animation = '';
    }

    function resetSlide(slide) {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.animation = 'none';
        void slide.offsetWidth;
    }

    function animateSlide(slide) {
        resetSlide(slide);
        
        // Activate slide
        slide.classList.add('active');
        slide.style.opacity = '1';
        slide.style.animation = 'darken 10s ease-in-out forwards';
        
        // Animate all reveal elements with proper delays
        const title = slide.querySelector('.title.reveal-anim');
        const description = slide.querySelector('.description.reveal-anim');
        const buttons = slide.querySelectorAll('.buttons .reveal-anim');
        
        if (title) forceAnimationRestart(title);
        if (description) {
            description.style.animationDelay = '0.4s';
            forceAnimationRestart(description);
        }
        
        buttons.forEach((btn, index) => {
            btn.style.animationDelay = `${0.6 + index * 0.2}s`;
            forceAnimationRestart(btn);
        });
    }

    function showSlide(index) {
        slides.forEach(resetSlide);
        currentSlide = index;
        animateSlide(slides[index]);
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
        resetTimer();
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
        resetTimer();
    }

    function startTimer() {
        slideInterval = setInterval(nextSlide, 10000);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    // Initialize main slider
    function initSlider() {
        animateSlide(slides[0]);
        startTimer();
        rightArrow.addEventListener('click', nextSlide);
        leftArrow.addEventListener('click', prevSlide);
    }

    initSlider();
    initServiceSlider();
});


