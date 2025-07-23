// Service Worker for BowMafia DAO
const CACHE_NAME = 'bowmafia-v2'; // Updated version
const urlsToCache = [
  '/',
  '/index.html',
  '/dao.html',
  '/shop.html',
  '/popouts.html',
  '/assets.html',
  '/css/styles.css',
  '/js/main.js',
  '/assets/images/BowMafia.png',
  '/assets/images/dao-background.jpg',
  '/assets/images/floating-element.png',
  '/assets/images/BOB.png',
  '/assets/videos/DAOasset.webm',
  '/assets/videos/DAOasset.mp4'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Force activation
});

// Fetch event with network-first strategy for better performance
self.addEventListener('fetch', function(event) {
  const url = event.request.url;
  // Skip chrome-extension requests
  if (url.startsWith('chrome-extension://')) return;
  
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // If fetch succeeds, update cache and return response
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(function() {
        // If fetch fails, try cache
        return caches.match(event.request);
      })
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
  self.clients.claim(); // Take control immediately
});
