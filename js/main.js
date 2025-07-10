// Initialize everything when DOM is ready and on page show events
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main.js loaded for page:', window.location.pathname);
    initializeAll();
});

// Handle browser back/forward navigation and page cache - simplified
window.addEventListener('pageshow', function(event) {
    console.log('Page show event triggered, persisted:', event.persisted);
    // Small delay to ensure everything is ready
    setTimeout(initializeAll, 50);
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

// Video Background Functionality - OPTIMIZED FOR DESKTOP BROWSERS
function initVideoBackground() {
    const video = document.querySelector('.fullscreen-video');
    
    if (!video) {
        console.log('No video background found on this page');
        return;
    }
    
    console.log('Initializing video background for desktop browsers');
    
    // Function to detect if device is mobile
    function isMobile() {
        return window.innerWidth <= 767 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Enhanced video loading specifically for desktop browsers
    function loadVideoSources() {
        console.log('Loading video sources, mobile:', isMobile());
        
        // Clear existing sources completely
        video.innerHTML = '';
        video.removeAttribute('poster'); // Remove any poster image
        
        // Set video attributes for optimal desktop performance
        video.setAttribute('autoplay', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('loop', 'true');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('preload', 'auto');
        video.setAttribute('webkit-playsinline', 'true');
        
        // Force video dimensions to prevent layout shifts
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        
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
            // Desktop sources - WebM first for better compression in modern browsers
            const desktopSourceWebm = document.createElement('source');
            desktopSourceWebm.src = 'assets/videos/bowmafia-video.webm';
            desktopSourceWebm.type = 'video/webm';
            video.appendChild(desktopSourceWebm);
            
            const desktopSourceMp4 = document.createElement('source');
            desktopSourceMp4.src = 'assets/videos/bowmafia-video.mp4';
            desktopSourceMp4.type = 'video/mp4';
            video.appendChild(desktopSourceMp4);
        }
        
        // NO FALLBACK IMAGE - Only video content
        
        // Enhanced video loading with aggressive retry logic
        function attemptPlay(attempts = 0) {
            if (attempts >= 5) {
                console.log('Max video play attempts reached, forcing reload');
                // Force complete reload of video element
                setTimeout(() => {
                    video.load();
                    setTimeout(() => attemptPlay(0), 500);
                }, 1000);
                return;
            }
            
            console.log(`Video play attempt ${attempts + 1}`);
            
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video playing successfully');
                    video.style.opacity = '1'; // Ensure video is visible
                }).catch(function(error) {
                    console.log(`Video autoplay attempt ${attempts + 1} failed:`, error);
                    
                    // Different retry strategies based on error type
                    if (error.name === 'NotAllowedError') {
                        // User interaction required - try muting and playing
                        video.muted = true;
                        setTimeout(() => attemptPlay(attempts + 1), 300);
                    } else if (error.name === 'NotSupportedError') {
                        // Format not supported - try next source
                        console.log('Video format not supported, trying next source');
                        setTimeout(() => attemptPlay(attempts + 1), 500);
                    } else {
                        // General error - retry with exponential backoff
                        const delay = Math.min(1000 * Math.pow(2, attempts), 5000);
                        setTimeout(() => attemptPlay(attempts + 1), delay);
                    }
                });
            } else {
                // Older browsers - retry after short delay
                setTimeout(() => attemptPlay(attempts + 1), 500);
            }
        }
        
        // Multiple event listeners to catch when video is ready
        const eventHandlers = {
            'loadstart': () => console.log('Video load started'),
            'loadedmetadata': () => {
                console.log('Video metadata loaded');
                attemptPlay();
            },
            'loadeddata': () => {
                console.log('Video data loaded');
                attemptPlay();
            },
            'canplay': () => {
                console.log('Video can start playing');
                attemptPlay();
            },
            'canplaythrough': () => {
                console.log('Video can play through');
                attemptPlay();
            }
        };
        
        // Remove existing event listeners and add new ones
        Object.keys(eventHandlers).forEach(event => {
            video.removeEventListener(event, eventHandlers[event]);
            video.addEventListener(event, eventHandlers[event], { once: true });
        });
        
        // Force video to reload with new sources
        video.load();
        
        // Fallback attempt after load
        setTimeout(() => {
            if (video.paused) {
                console.log('Video still paused after load, forcing play');
                attemptPlay();
            }
        }, 1000);
        
        // Handle video errors with reload
        video.addEventListener('error', function(e) {
            console.error('Video error occurred:', e);
            console.log('Video error details:', {
                error: video.error,
                networkState: video.networkState,
                readyState: video.readyState
            });
            
            // Try reloading after error
            setTimeout(() => {
                console.log('Reloading video after error');
                loadVideoSources();
            }, 2000);
        });
        
        // Handle stalled events
        video.addEventListener('stalled', function() {
            console.log('Video stalled, attempting to recover');
            setTimeout(() => {
                if (video.paused) {
                    attemptPlay();
                }
            }, 1000);
        });
    }
    
    // Load initial video sources
    loadVideoSources();
    
    // Reload video sources on window resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log('Window resized, reloading video sources');
            loadVideoSources();
        }, 500);
    });
    
    // Additional recovery mechanisms
    let recoveryInterval = setInterval(() => {
        if (video.paused && !document.hidden && video.readyState >= 2) {
            console.log('Video unexpectedly paused, attempting recovery');
            video.play().catch(e => console.log('Recovery play failed:', e));
        }
    }, 3000);
    
    // Clean up interval when page is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(recoveryInterval);
        } else {
            // Restart recovery when page becomes visible
            recoveryInterval = setInterval(() => {
                if (video.paused && !document.hidden && video.readyState >= 2) {
                    console.log('Video unexpectedly paused, attempting recovery');
                    video.play().catch(e => console.log('Recovery play failed:', e));
                }
            }, 3000);
            
            // Force play when returning to page
            if (video.paused) {
                setTimeout(() => video.play().catch(e => console.log('Visibility play failed:', e)), 100);
            }
        }
    });
    
    console.log('Video background initialized successfully with desktop optimization');
}

// Hamburger Menu Functionality - SIMPLIFIED TO AVOID CONFLICTS
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (!hamburgerBtn || !menuOverlay) {
        console.log('Hamburger menu not found on this page');
        return;
    }
    
    console.log('Initializing hamburger menu');
    
    // Ensure menu is closed
    hamburgerBtn.classList.remove('active');
    menuOverlay.classList.remove('active');
    
    // Simple approach - just reset the onclick handlers
    hamburgerBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger button clicked');
        
        hamburgerBtn.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    };
    
    // Close menu when clicking on overlay or menu items
    menuOverlay.onclick = function(e) {
        if (e.target === menuOverlay || e.target.classList.contains('menu-item')) {
            console.log('Menu overlay clicked, closing menu');
            hamburgerBtn.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    };
    
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