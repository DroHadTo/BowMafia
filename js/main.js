// Initialize everything when DOM is ready and on page show events
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main.js loaded for page:', window.location.pathname);
    initializeAll();
});

// Handle browser back/forward navigation and page cache
window.addEventListener('pageshow', function(event) {
    console.log('Page show event triggered, persisted:', event.persisted);
    // Always reinitialize when page is shown (including from back/forward cache)
    initializeAll();
});

// Handle visibility changes (when user returns to tab)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('Page became visible, reinitializing...');
        initializeAll();
    }
});

// Master initialization function
function initializeAll() {
    console.log('Initializing all components...');
    
    // Initialize video background first
    initVideoBackground();
    
    // Initialize hamburger menu
    initHamburgerMenu();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Force any specific page functions to run
    if (window.location.pathname.includes('dao.html')) {
        // Ensure DAO form functions are working
        if (typeof togglePaymentAddress === 'function') {
            console.log('DAO page specific functions available');
        }
    }
}

// Make toggleBowDogFields function global so it can be called from HTML
function toggleBowDogFields() {
    const bowDogYes = document.getElementById('bowDogYes');
    const bowDogFields = document.getElementById('bowDogFields');
    
    if (bowDogYes && bowDogYes.checked) {
        bowDogFields.style.display = 'block';
    } else {
        bowDogFields.style.display = 'none';
    }
}

// Video Background Functionality - ENHANCED FOR NAVIGATION ISSUES
function initVideoBackground() {
    const video = document.querySelector('.fullscreen-video');
    
    if (!video) {
        console.log('No video background found on this page');
        return;
    }
    
    console.log('Initializing video background');
    
    // Function to detect if device is mobile
    function isMobile() {
        return window.innerWidth <= 767 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Function to load appropriate video sources
    function loadVideoSources() {
        console.log('Loading video sources, mobile:', isMobile());
        
        // Clear existing sources
        video.innerHTML = '';
        
        if (isMobile()) {
            // Mobile sources
            const mobileSourceMp4 = document.createElement('source');
            mobileSourceMp4.src = 'assets/videos/bowmafia-videomobile.mp4';
            mobileSourceMp4.type = 'video/mp4';
            video.appendChild(mobileSourceMp4);
            
            const mobileSourceWebm = document.createElement('source');
            mobileSourceWebm.src = 'assets/videos/bowmafia-videomobile.webm';
            mobileSourceWebm.type = 'video/webm';
            video.appendChild(mobileSourceWebm);
        } else {
            // Desktop sources
            const desktopSourceMp4 = document.createElement('source');
            desktopSourceMp4.src = 'assets/videos/bowmafia-video.mp4';
            desktopSourceMp4.type = 'video/mp4';
            video.appendChild(desktopSourceMp4);
            
            const desktopSourceWebm = document.createElement('source');
            desktopSourceWebm.src = 'assets/videos/bowmafia-video.webm';
            desktopSourceWebm.type = 'video/webm';
            video.appendChild(desktopSourceWebm);
        }
        
        // Add fallback text
        const fallbackText = document.createTextNode('Your browser does not support the video tag.');
        video.appendChild(fallbackText);
        
        // Force video to reload with new sources
        video.load();
        
        // Enhanced video loading with multiple retry attempts
        function attemptPlay(attempts = 0) {
            if (attempts >= 3) {
                console.log('Max video play attempts reached');
                return;
            }
            
            video.play().then(() => {
                console.log('Video playing successfully');
            }).catch(function(error) {
                console.log(`Video autoplay attempt ${attempts + 1} failed:`, error);
                // Retry after a short delay
                setTimeout(() => attemptPlay(attempts + 1), 500);
            });
        }
        
        // Start play attempts after video loads
        video.addEventListener('loadeddata', function() {
            console.log('Video data loaded, attempting to play');
            attemptPlay();
        });
        
        // If video is already loaded, start playing immediately
        if (video.readyState >= 2) {
            console.log('Video already loaded, playing immediately');
            attemptPlay();
        }
    }
    
    // Remove any existing event listeners to prevent duplicates
    video.removeEventListener('error', handleVideoError);
    
    // Handle video errors
    function handleVideoError(e) {
        console.error('Video error:', e);
        // Try reloading the video sources
        setTimeout(loadVideoSources, 1000);
    }
    
    video.addEventListener('error', handleVideoError);
    
    // Load initial video sources
    loadVideoSources();
    
    // Reload video sources on window resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(loadVideoSources, 250);
    });
    
    console.log('Video background initialized successfully');
}

// Hamburger Menu Functionality - ENHANCED FOR NAVIGATION ISSUES
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (!hamburgerBtn || !menuOverlay) {
        console.log('Hamburger menu not found on this page');
        return;
    }
    
    console.log('Initializing hamburger menu');
    
    // Remove existing event listeners to prevent duplicates
    const newHamburgerBtn = hamburgerBtn.cloneNode(true);
    hamburgerBtn.parentNode.replaceChild(newHamburgerBtn, hamburgerBtn);
    
    const newMenuOverlay = menuOverlay.cloneNode(true);
    menuOverlay.parentNode.replaceChild(newMenuOverlay, menuOverlay);
    
    // Get references to the new elements
    const freshHamburgerBtn = document.getElementById('hamburger-btn');
    const freshMenuOverlay = document.getElementById('menu-overlay');
    
    // Add click handler to hamburger button
    freshHamburgerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger button clicked');
        
        freshHamburgerBtn.classList.toggle('active');
        freshMenuOverlay.classList.toggle('active');
    });
    
    // Close menu when clicking outside or on menu items
    freshMenuOverlay.addEventListener('click', function(e) {
        if (e.target === freshMenuOverlay || e.target.classList.contains('menu-item')) {
            console.log('Menu overlay clicked, closing menu');
            freshHamburgerBtn.classList.remove('active');
            freshMenuOverlay.classList.remove('active');
        }
    });
    
    // Close menu when clicking anywhere on document (with escape key)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && freshMenuOverlay.classList.contains('active')) {
            console.log('Escape key pressed, closing menu');
            freshHamburgerBtn.classList.remove('active');
            freshMenuOverlay.classList.remove('active');
        }
    });
    
    // Ensure menu is closed on page load
    freshHamburgerBtn.classList.remove('active');
    freshMenuOverlay.classList.remove('active');
    
    console.log('Hamburger menu initialized successfully');
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a, .menu-item[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links (those starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Enhanced video monitoring and recovery
setInterval(function() {
    const video = document.querySelector('.fullscreen-video');
    if (video && video.paused && !document.hidden) {
        console.log('Video paused unexpectedly, attempting to restart');
        video.play().catch(function(error) {
            console.log('Video restart failed:', error);
        });
    }
}, 5000); // Check every 5 seconds

console.log('Main.js loaded successfully');