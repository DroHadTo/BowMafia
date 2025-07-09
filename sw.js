// Service Worker for BowMafia DAO
const CACHE_NAME = 'bowmafia-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dao.html',
  '/shop.html',
  '/popouts.html',
  '/payment.html',
  '/css/styles.css',
  '/js/main.js',
  '/assets/images/BowMafia.png',
  '/assets/images/dao-background.jpg',
  '/assets/images/floating-element.png',
  '/manifest.json'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
