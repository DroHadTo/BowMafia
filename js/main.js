// Global navigation and page utilities
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main.js loaded for page:', window.location.pathname);
    
    // Initialize hamburger menu if present
    initHamburgerMenu();
    
    // Initialize video background if present
    initVideoBackground();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
});

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

// Hamburger Menu Functionality
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (!hamburgerBtn || !menuOverlay) {
        console.log('Hamburger menu not found on this page');
        return;
    }
    
    console.log('Initializing hamburger menu');
    
    // Toggle menu on button click
    hamburgerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = hamburgerBtn.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when clicking on overlay or menu items
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay || e.target.classList.contains('menu-item')) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });
    
    function openMenu() {
        hamburgerBtn.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeMenu() {
        hamburgerBtn.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    console.log('Hamburger menu initialized successfully');
}

// Video Background Functionality
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
        
        // Ensure video plays after loading
        video.play().catch(function(error) {
            console.log('Video autoplay was prevented:', error);
        });
    }
    
    // Handle video loading errors
    video.addEventListener('error', function(e) {
        console.error('Video loading error:', e);
        // Try reloading the video
        setTimeout(loadVideoSources, 1000);
    });
    
    // Load initial video sources
    loadVideoSources();
    
    // Reload video sources on window resize (in case orientation changes)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            loadVideoSources();
        }, 250);
    });
    
    console.log('Video background initialized successfully');
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

// Page visibility handling to ensure video plays when returning to page
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const video = document.querySelector('.fullscreen-video');
        if (video && video.paused) {
            video.play().catch(function(error) {
                console.log('Video play failed on visibility change:', error);
            });
        }
    }
});

// Handle page navigation events to ensure proper initialization
window.addEventListener('pageshow', function(event) {
    console.log('Page show event, persisted:', event.persisted);
    
    if (event.persisted) {
        // Page was loaded from cache, reinitialize
        setTimeout(function() {
            initVideoBackground();
            initHamburgerMenu();
        }, 100);
    }
});

// Ensure proper cleanup and initialization when navigating
window.addEventListener('beforeunload', function() {
    console.log('Page unloading');
});

// Force video reload when returning to a page
window.addEventListener('focus', function() {
    const video = document.querySelector('.fullscreen-video');
    if (video && video.paused) {
        video.play().catch(function(error) {
            console.log('Video play failed on focus:', error);
        });
    }
});

console.log('Main.js initialization complete');