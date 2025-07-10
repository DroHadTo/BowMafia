// Performance optimizations
const PERFORMANCE_CONFIG = {
    enableLazyLoading: true,
    debounceDelay: 300,
    intersectionThreshold: 0.1,
    maxRetries: 3,
    retryDelay: 1000,
    videoLoadTimeout: 10000,
    preventMultipleListeners: true
};

// State management
let appState = {
    isMenuOpen: false,
    isInitialized: false,
    videoLoaded: false,
    activeDropdown: null,
    currentPage: 'home',
    hamburgerListenerAttached: false,
    videoRetryCount: 0
};

// Utility functions
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

const createOptimizedVideoElement = () => {
    const video = document.querySelector('.fullscreen-video');
    if (!video) return null;
    
    // Clear any existing sources
    video.innerHTML = '';
    
    // Create source elements
    const sources = [];
    
    // WebM sources (prioritized for better performance)
    if (window.innerWidth >= 768) {
        sources.push({
            src: 'assets/videos/bowmafia-video.webm',
            type: 'video/webm'
        });
        sources.push({
            src: 'assets/videos/bowmafia-video.mp4',
            type: 'video/mp4'
        });
    } else {
        sources.push({
            src: 'assets/videos/bowmafia-videomobile.webm',
            type: 'video/webm'
        });
        sources.push({
            src: 'assets/videos/bowmafia-videomobile.mp4',
            type: 'video/mp4'
        });
    }
    
    // Add sources to video element
    sources.forEach(source => {
        const sourceElement = document.createElement('source');
        sourceElement.src = source.src;
        sourceElement.type = source.type;
        video.appendChild(sourceElement);
    });
    
    // Add fallback text
    const fallbackText = document.createTextNode('Your browser does not support the video tag.');
    video.appendChild(fallbackText);
    
    return video;
};

// Enhanced video loading with retry logic
const loadVideoWithRetry = (video, retryCount = 0) => {
    return new Promise((resolve, reject) => {
        if (!video) {
            reject(new Error('Video element not found'));
            return;
        }
        
        const timeoutId = setTimeout(() => {
            console.warn('Video load timeout');
            if (retryCount < PERFORMANCE_CONFIG.maxRetries) {
                console.log(`Retrying video load... Attempt ${retryCount + 1}`);
                setTimeout(() => {
                    loadVideoWithRetry(video, retryCount + 1)
                        .then(resolve)
                        .catch(reject);
                }, PERFORMANCE_CONFIG.retryDelay);
            } else {
                reject(new Error('Video load failed after maximum retries'));
            }
        }, PERFORMANCE_CONFIG.videoLoadTimeout);
        
        const onLoadedData = () => {
            clearTimeout(timeoutId);
            video.removeEventListener('loadeddata', onLoadedData);
            video.removeEventListener('error', onError);
            appState.videoLoaded = true;
            console.log('Video loaded successfully');
            resolve(video);
        };
        
        const onError = (error) => {
            clearTimeout(timeoutId);
            video.removeEventListener('loadeddata', onLoadedData);
            video.removeEventListener('error', onError);
            console.error('Video load error:', error);
            
            if (retryCount < PERFORMANCE_CONFIG.maxRetries) {
                console.log(`Retrying video load... Attempt ${retryCount + 1}`);
                setTimeout(() => {
                    // Recreate video sources for retry
                    createOptimizedVideoElement();
                    loadVideoWithRetry(video, retryCount + 1)
                        .then(resolve)
                        .catch(reject);
                }, PERFORMANCE_CONFIG.retryDelay);
            } else {
                reject(error);
            }
        };
        
        video.addEventListener('loadeddata', onLoadedData, { once: true });
        video.addEventListener('error', onError, { once: true });
        
        // Force load if not already loading
        if (video.readyState < 3) {
            video.load();
        } else {
            onLoadedData();
        }
    });
};

// Initialize video background
const initializeVideoBackground = async () => {
    try {
        const video = createOptimizedVideoElement();
        if (!video) return;
        
        // Set video attributes for optimal performance
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.preload = 'metadata';
        
        // Load and play video
        await loadVideoWithRetry(video);
        
        // Ensure video plays
        try {
            await video.play();
            console.log('Video playing successfully');
        } catch (playError) {
            console.warn('Video autoplay failed:', playError);
            // Try to play on user interaction
            document.addEventListener('click', () => {
                video.play().catch(console.error);
            }, { once: true });
        }
        
        // Handle visibility change to resume video
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && video.paused) {
                video.play().catch(console.error);
            }
        });
        
        // Handle window focus to resume video
        window.addEventListener('focus', () => {
            if (video.paused) {
                video.play().catch(console.error);
            }
        });
        
    } catch (error) {
        console.error('Failed to initialize video background:', error);
    }
};

// Initialize hamburger menu
const initializeHamburgerMenu = () => {
    // Prevent multiple listeners
    if (appState.hamburgerListenerAttached) return;
    
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (!hamburgerBtn || !menuOverlay) return;
    
    const toggleMenu = () => {
        appState.isMenuOpen = !appState.isMenuOpen;
        hamburgerBtn.classList.toggle('active', appState.isMenuOpen);
        menuOverlay.classList.toggle('active', appState.isMenuOpen);
        document.body.classList.toggle('menu-open', appState.isMenuOpen);
    };
    
    const closeMenu = () => {
        if (appState.isMenuOpen) {
            appState.isMenuOpen = false;
            hamburgerBtn.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    };
    
    // Add click listener for hamburger button
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (appState.isMenuOpen && !menuOverlay.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && appState.isMenuOpen) {
            closeMenu();
        }
    });
    
    appState.hamburgerListenerAttached = true;
};

// Initialize smooth scrolling
const initializeSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Initialize service worker
const initializeServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
};

// Main initialization
const initializeApp = async () => {
    if (appState.isInitialized) return;
    
    try {
        // Initialize core features
        await initializeVideoBackground();
        initializeHamburgerMenu();
        initializeSmoothScrolling();
        initializeServiceWorker();
        
        appState.isInitialized = true;
        console.log('App initialized successfully');
        
    } catch (error) {
        console.error('App initialization failed:', error);
    }
};

// Page visibility and focus handlers
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Reinitialize when page becomes visible
        initializeApp();
    }
});

window.addEventListener('focus', () => {
    // Reinitialize when window gains focus
    initializeApp();
});

// DOM ready handler
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}