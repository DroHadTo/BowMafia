// BowMafia Website - Simplified Main JS
// Fast, reliable initialization without complex state management

// Core initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('BowMafia website initialized');
    
    // Load video with proper sources
    loadVideoSources();
    
    // Setup hamburger menu
    setupHamburgerMenu();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup form handlers
    setupFormHandlers();
});

// Video loading - simple and reliable
function loadVideoSources() {
    const video = document.querySelector('.fullscreen-video');
    if (!video) return;
    
    // Clear existing sources
    video.innerHTML = '';
    
    // Add appropriate sources based on screen size
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Mobile sources
        video.innerHTML = `
            <source src="assets/videos/bowmafia-videomobile.webm" type="video/webm">
            <source src="assets/videos/bowmafia-videomobile.mp4" type="video/mp4">
        `;
    } else {
        // Desktop sources
        video.innerHTML = `
            <source src="assets/videos/bowmafia-video.webm" type="video/webm">
            <source src="assets/videos/bowmafia-video.mp4" type="video/mp4">
        `;
    }
    
    // Load the video
    video.load();
    
    // Play if possible
    video.play().catch(e => {
        console.log('Video autoplay prevented by browser');
    });
}

// Hamburger menu - simple toggle
function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.menu-overlay');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking nav links
    document.querySelectorAll('.menu-overlay a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handlers
function setupFormHandlers() {
    // BowDog fields toggle
    const bowDogYes = document.getElementById('bowDogYes');
    const bowDogNo = document.getElementById('bowDogNo');
    
    if (bowDogYes && bowDogNo) {
        bowDogYes.addEventListener('change', toggleBowDogFields);
        bowDogNo.addEventListener('change', toggleBowDogFields);
    }
    
    // Payment asset change
    const paymentAsset = document.getElementById('paymentAsset');
    if (paymentAsset) {
        paymentAsset.addEventListener('change', togglePaymentFields);
    }
}

// Toggle BowDog fields
function toggleBowDogFields() {
    const bowDogYes = document.getElementById('bowDogYes');
    const bowDogFields = document.getElementById('bowDogFields');
    
    if (bowDogYes && bowDogFields) {
        bowDogFields.style.display = bowDogYes.checked ? 'block' : 'none';
    }
}

// Toggle payment fields
function togglePaymentFields() {
    const paymentAsset = document.getElementById('paymentAsset');
    const solanaAddressField = document.getElementById('solanaAddressField');
    const dogeAddressField = document.getElementById('dogeAddressField');
    
    if (!paymentAsset || !solanaAddressField || !dogeAddressField) return;
    
    const selectedValue = paymentAsset.value;
    
    // Hide both fields first
    solanaAddressField.style.display = 'none';
    dogeAddressField.style.display = 'none';
    
    // Show the appropriate field
    if (selectedValue === 'solana') {
        solanaAddressField.style.display = 'block';
    } else if (selectedValue === 'doge') {
        dogeAddressField.style.display = 'block';
    }
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.select();
    element.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        const button = element.nextElementSibling;
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.background = '#4CAF50';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#b19cd9';
            }, 2000);
        }
    } catch (err) {
        console.error('Copy failed:', err);
    }
}

// Handle page cache restoration
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        const video = document.querySelector('.fullscreen-video');
        if (video && video.paused) {
            video.play().catch(e => console.log('Video resume from cache failed:', e));
        }
    }
});

// Service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered successfully');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
