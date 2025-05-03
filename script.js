document.addEventListener('DOMContentLoaded', function(){
  // Back to Top Button Functionality
  // Shows/hides the back-to-top button based on scroll position
  const toTopBtn = document.querySelector('.toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { // When scrolled down more than 50px
      toTopBtn.classList.add('visible'); // Show the button
    } else {
      toTopBtn.classList.remove('visible'); // Hide the button
    }
  });

  // Auto-hide Navigation Bar on Scroll Down
  // Show on scroll up, hide on scroll down
  let lastScrollTop = 0;
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", function () {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Hide navbar when scrolling down
    if (currentScroll > lastScrollTop) {
      navbar.style.top = "-60px";
    } else {
      // Show navbar when scrolling up
      navbar.style.top = "0";
    }
    
    // Update the last scroll position
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
});

document.addEventListener('DOMContentLoaded', function () {
//Fullscreen View
const imageContainers = document.querySelectorAll('.image-container');
const fullscreenViewer = document.getElementById('fullscreen-viewer');
const fullscreenImage = document.getElementById('fullscreen-image');

imageContainers.forEach(container => {
  container.addEventListener('click', () => {
    const img = container.querySelector('img');
    fullscreenImage.src = img.src;
    fullscreenViewer.classList.remove('hidden');
  });
});

// Close viewer when clicking outside the image
fullscreenViewer.addEventListener('click', (e) => {
  if (e.target === fullscreenViewer) {
    fullscreenViewer.classList.add('hidden');
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
  // Image Carousel for Showcase Page
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const dotsContainer = document.querySelector('.dots-container');
  
  // Configuration for visible slides and indexes
  const visibleSlides = 3; // Number of slides visible at once
  const totalSlides = slides.length;
  const maxIndex = totalSlides - visibleSlides; // Maximum slide index
  
  // Initialize state variables
  let currentIndex = 0;
  let startPos = 0; // For touch events
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  
  // Calculate slide width including margin
  const slideWidth = slides[0].offsetWidth + 20; // 20px is the margin-right
  
  // Create navigation dots based on number of possible positions
  for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active'); // Activate first dot
      dot.addEventListener('click', () => goToSlide(i)); // Add click handler
      dotsContainer.appendChild(dot);
  }
  
  const dots = document.querySelectorAll('.dot');
  
  // Touch Event Handlers
  slider.addEventListener('touchstart', touchStart);
  slider.addEventListener('touchmove', touchMove);
  slider.addEventListener('touchend', touchEnd);
  
  // Mouse Event Handlers for dragging slides
  slider.addEventListener('mousedown', touchStart);
  slider.addEventListener('mousemove', touchMove);
  slider.addEventListener('mouseup', touchEnd);
  slider.addEventListener('mouseleave', touchEnd);
  
  // Mouse wheel event for scrolling through slides
  document.querySelector('.slider-container').addEventListener('wheel', (e) => {
      e.preventDefault(); // Prevent page scrolling
      if (e.deltaX > 0 || e.deltaY > 0) {
          // Scroll right/down
          if (currentIndex < maxIndex) {
              goToSlide(currentIndex + 1);
          }
      } else {
          // Scroll left/up
          if (currentIndex > 0) {
              goToSlide(currentIndex - 1);
          }
      }
      
      // Reset auto slide timer when user interacts
      clearInterval(interval);
      interval = setInterval(autoSlide, 3000);
  });
  
  // Disable context menu on slider for better UX
  slider.addEventListener('contextmenu', e => e.preventDefault());
  
  // Button Navigation Handlers
  prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
          goToSlide(currentIndex - 1);
      } else {
          goToSlide(maxIndex); // Loop back to last position
      }
  });
  
  nextBtn.addEventListener('click', () => {
      if (currentIndex < maxIndex) {
          goToSlide(currentIndex + 1);
      } else {
          goToSlide(0); // Loop back to first position
      }
  });
  
  // Set up auto sliding every 3 seconds
  let interval = setInterval(autoSlide, 3000);
  
  // Auto slide function moves to next slide or loops to beginning
  function autoSlide() {
      if (currentIndex < maxIndex) {
          goToSlide(currentIndex + 1);
      } else {
          goToSlide(0);
      }
  }
  
  // Helper function to get pointer/touch position
  function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
  
  // Handle touch/drag start
  function touchStart(event) {
      startPos = getPositionX(event);
      isDragging = true;
      
      // Clear auto slide when user interacts
      clearInterval(interval);
  }
  
  // Handle touch/drag move
  function touchMove(event) {
      if (isDragging) {
          const currentPosition = getPositionX(event);
          currentTranslate = prevTranslate + currentPosition - startPos;
      }
  }
  
  // Handle touch/drag end - determines if slide should change
  function touchEnd() {
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      
      // Change slide based on movement distance
      if (movedBy < -50 && currentIndex < maxIndex) {
          goToSlide(currentIndex + 1); // Next slide
      } else if (movedBy > 50 && currentIndex > 0) {
          goToSlide(currentIndex - 1); // Previous slide
      } else {
          goToSlide(currentIndex); // Stay on current slide
      }
      
      // Restart auto slide interval
      clearInterval(interval);
      interval = setInterval(autoSlide, 5000);
  }
  
  // Main function to change slide position
  function goToSlide(index) {
      slider.style.transform = `translateX(${-index * slideWidth}px)`;
      currentIndex = index;
      prevTranslate = -index * slideWidth;
      currentTranslate = prevTranslate;
      
      // Update active dot indicator
      dots.forEach((dot, i) => {
          if (i === index) {
              dot.classList.add('active');
          } else {
              dot.classList.remove('active');
          }
      });
  }
  
  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
          if (currentIndex > 0) {
              goToSlide(currentIndex - 1);
          }
      } else if (e.key === 'ArrowRight') {
          if (currentIndex < maxIndex) {
              goToSlide(currentIndex + 1);
          }
      }
  });
  
  // Handle window resize to keep slides aligned
  window.addEventListener('resize', () => {
      // Recalculate slide width and maintain position
      goToSlide(currentIndex);
  });
});