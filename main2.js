document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const logo = document.querySelector('.logo img');
    const navLinks = document.querySelectorAll('.nav-link');
    const phoneIcon = document.querySelector('.phone i');
    const phoneText = document.querySelector('.phone span');

    window.addEventListener('scroll', function() {
        const sliderHeight = document.querySelector('.slider-container').offsetHeight;
        if (window.scrollY > sliderHeight * 0.5) {
            navbar.classList.add('scrolled');
            logo.style.filter = ''; // Remove inline filter
        } else {
            navbar.classList.remove('scrolled');
            logo.style.filter = ''; // Remove inline filter
        }
    });

    // Main slider functionality
    const slides = document.querySelectorAll('.slide');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentSlide = 0;
    let slideInterval;

    // Function to display a specific slide and trigger its animations
    function showSlide(index) {
        // Deactivate the current slide
        if (slides[currentSlide]) {
            slides[currentSlide].classList.remove('active');
            slides[currentSlide].style.opacity = '0';
            // Stop the background darken animation on the outgoing slide (good practice)
            slides[currentSlide].style.animation = 'none';

            // Remove the animation trigger class from the outgoing slide's elements
            const oldRevealElements = slides[currentSlide].querySelectorAll('.reveal-anim');
            oldRevealElements.forEach(el => {
                el.classList.remove('is-revealing');
            });
        }

        // Calculate the index for the next slide, handling wrapping
        currentSlide = (index + slides.length) % slides.length;
        if (currentSlide < 0) { // Handle negative index from prevSlide
            currentSlide = slides.length - 1;
        }

        // Activate the new slide
        const activeSlide = slides[currentSlide];
        activeSlide.classList.add('active');
        activeSlide.style.opacity = '1';
        // --- REMOVE the following lines that applied the background animation via JS ---
        // activeSlide.style.animation = 'none'; // Remove previous state
        // void activeSlide.offsetWidth; // Trigger reflow
        // activeSlide.style.animation = 'darken 10s ease-in-out forwards'; // THIS LINE IS REMOVED
        // --------------------------------------------------------------------------


        // Select reveal elements *within* the active slide
        const revealElements = activeSlide.querySelectorAll('.reveal-anim');

        // Add the animation trigger class to elements and force reflow to start animation
        revealElements.forEach(el => {
            el.classList.add('is-revealing');
            // Force a reflow *after* adding the class to ensure the animation starts
            void el.offsetWidth;
        });


        // Restart the automatic slide timer
        resetTimer();
    }

    // Navigate to the next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Navigate to the previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Start the automatic slide timer
    function startTimer() {
        // Clear any existing timer before starting a new one
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 7000); // Change slide every 10 seconds
    }

    // Reset the automatic slide timer
    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    // Initialize the main slider on page load
    function initSlider() {
        // Show the first slide and start the timer
        showSlide(0);

        // Add event listeners for navigation arrows
        rightArrow.addEventListener('click', nextSlide);
        leftArrow.addEventListener('click', prevSlide);
    }

    // Run initialization when the DOM is ready
    initSlider();
});



document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.projects-slider');
  const prevBtn = document.querySelector('.prev-arrow');
  const nextBtn = document.querySelector('.next-arrow');
  const projectsContainer = document.querySelector('.projects-slider-container');
  
  // Sample projects data (replace with your actual data)

  const projects = [
  {
    image: '20.jpg',
    category: 'Industry',
    title: 'Industrial Construction',
    description: 'We built a state-of-the-art manufacturing facility with optimized production zones and advanced safety systems, completing the project on schedule.'
  },
  {
    image: '21.jpg',
    category: 'Energy',
    title: 'Solar Power Installation',
    description: 'Installed a large solar array that now powers hundreds of homes, featuring smart grid technology and efficient energy storage solutions.'
  },
  {
    image: '22.jpg',
    category: 'Manufacturing',
    title: 'Production Line',
    description: 'Modernized the assembly process with automated systems that increased output by 40% while improving product quality and worker safety.'
  },
  {
    image: '23.jpg',
    category: 'Logistics',
    title: 'Warehouse Automation',
    description: 'Implemented robotic systems and smart inventory management that reduced processing time by 65% while maximizing storage capacity.'
  },
  {
    image: '24.jpg',
    category: 'Construction',
    title: 'Commercial Building',
    description: 'Designed and constructed an innovative office complex with sustainable features and smart technologies, achieving LEED certification.'
  }
];
  
  // Generate project cards
  function generateProjects() {
    slider.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
      projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <div class="project-image">
              <img src="${project.image}" alt="${project.title}">
          </div>
          <div class="corner-tr"></div>
          <div class="corner-bl"></div>
          <div class="project-content">
              <button class="project-category">${project.category}</button>
              <h3 class="project-title">${project.title}</h3>
              <p class="project-description">${project.description}</p>
          </div>
        `;
        slider.appendChild(card);
      });
    }
  }
  
  generateProjects();
  
  const cards = document.querySelectorAll('.project-card');
  let cardWidth = cards[0].offsetWidth + 20;
  let currentPosition = 0;
  let isAnimating = false;
  let autoSlideInterval;
  
  // Set initial position
  const middleSet = Math.floor(projects.length * 1.5);
  currentPosition = -middleSet * cardWidth;
  slider.style.transform = `translateX(${currentPosition}px)`;
  
  function slideTo(position, instant = false) {
    if (isAnimating) return;
    isAnimating = true;
    
    slider.style.transition = instant ? 'none' : 'transform 0.5s ease';
    slider.style.transform = `translateX(${position}px)`;
    
    if (!instant) {
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    } else {
      isAnimating = false;
    }
  }
  
  function nextSlide() {
    currentPosition -= cardWidth;
    slideTo(currentPosition);
    
    if (currentPosition <= -projects.length * 2 * cardWidth) {
      setTimeout(() => {
        currentPosition = -projects.length * cardWidth;
        slideTo(currentPosition, true);
      }, 500);
    }
  }
  
  function prevSlide() {
    currentPosition += cardWidth;
    slideTo(currentPosition);
    
    if (currentPosition >= 0) {
      setTimeout(() => {
        currentPosition = -projects.length * cardWidth;
        slideTo(currentPosition, true);
      }, 500);
    }
  }
  
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
  
  function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
  }
  
  // Initialize
  startAutoSlide();
  
  // Event listeners
  nextBtn.addEventListener('click', () => {
    pauseAutoSlide();
    nextSlide();
    startAutoSlide();
  });
  
  prevBtn.addEventListener('click', () => {
    pauseAutoSlide();
    prevSlide();
    startAutoSlide();
  });
  
  // Improved hover handling
  projectsContainer.addEventListener('mouseenter', pauseAutoSlide);
  projectsContainer.addEventListener('mouseleave', startAutoSlide);
  
  // Handle window resize
  window.addEventListener('resize', function() {
    const newCardWidth = cards[0].offsetWidth + 20;
    const ratio = cardWidth / newCardWidth;
    currentPosition = currentPosition * ratio;
    cardWidth = newCardWidth;
    slideTo(currentPosition, true);
  });
});



// Add this to your JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('consultationForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Here you would typically send the data to your server
      console.log('Form submitted:', data);
      
      // Show success message (you can customize this)
      alert('Thank you for your submission! We will contact you shortly.');
      
      // Reset the form
      form.reset();
      
      // Reset labels position if needed
      const labels = form.querySelectorAll('label');
      labels.forEach(label => {
        const input = document.getElementById(label.getAttribute('for'));
        if (input && input.value === '') {
          label.style.top = '15px';
          label.style.left = '15px';
          label.style.fontSize = '1rem';
          label.style.color = '#999';
          label.style.backgroundColor = '#fff';
        }
      });
    });
  }
  
  // Add animation to benefit items when they come into view
  const benefitItems = document.querySelectorAll('.benefit-item');
  
  const animateOnScroll = function() {
    benefitItems.forEach(item => {
      const itemPosition = item.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (itemPosition < screenPosition) {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Set initial state for animation
  benefitItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Check on load
  animateOnScroll();
  
  // Check on scroll
  window.addEventListener('scroll', animateOnScroll);
});