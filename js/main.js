document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links with improved performance
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Use native smooth scrolling with better performance
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, { passive: false });
    });
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

document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.fullscreen-video');
    
    // Function to detect if device is mobile
    function isMobile() {
        return window.innerWidth <= 767 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Function to load appropriate video sources - only if video element exists
    function loadVideoSources() {
        if (!video) return; // Exit if no video element
        
        // Clear existing sources
        video.innerHTML = '';
        
        if (isMobile()) {
            // Mobile sources
            const mobileSourceWebm = document.createElement('source');
            mobileSourceWebm.src = 'assets/videos/bowmafia-videomobile.webm';
            mobileSourceWebm.type = 'video/webm';
            video.appendChild(mobileSourceWebm);
            
            const mobileSourceMp4 = document.createElement('source');
            mobileSourceMp4.src = 'assets/videos/bowmafia-videomobile.mp4';
            mobileSourceMp4.type = 'video/mp4';
            video.appendChild(mobileSourceMp4);
        } else {
            // Desktop sources
            const desktopSourceWebm = document.createElement('source');
            desktopSourceWebm.src = 'assets/videos/bowmafia-video.webm';
            desktopSourceWebm.type = 'video/webm';
            video.appendChild(desktopSourceWebm);
            
            const desktopSourceMp4 = document.createElement('source');
            desktopSourceMp4.src = 'assets/videos/bowmafia-video.mp4';
            desktopSourceMp4.type = 'video/mp4';
            video.appendChild(desktopSourceMp4);
        }
        
        // Add fallback text
        const fallbackText = document.createTextNode('Your browser does not support the video tag.');
        video.appendChild(fallbackText);
        
        // Force video to reload with new sources
        video.load();
    }
    
    // Load initial video sources only if video exists
    if (video) {
        loadVideoSources();
    }
    
    // Reload video sources on window resize (in case orientation changes)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            loadVideoSources();
        }, 250);
    });
    
    // Hamburger Menu Functionality
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (hamburgerBtn && menuOverlay) {
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });
        
        // Close menu when clicking outside or on menu items
        menuOverlay.addEventListener('click', function(e) {
            if (e.target === menuOverlay || e.target.classList.contains('menu-item')) {
                hamburgerBtn.classList.remove('active');
                menuOverlay.classList.remove('active');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                menuOverlay.classList.remove('active');
            }
        });
    }
    
    // Passive event listeners for better performance
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (video) loadVideoSources();
        }, 250);
    }, { passive: true });
    
    // Log for debugging (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Mobile detected:', isMobile());
        console.log('Video sources loaded');
        console.log('Hamburger menu initialized');
    }
});

// Service Worker registration for better performance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('ServiceWorker registration successful');
                }
            })
            .catch(function(error) {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('ServiceWorker registration failed: ', error);
                }
            });
    });
}