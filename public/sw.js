// CABI Plant Diagnosis Assistant - Workbox Service Worker for Offline Field Conditions
/* global workbox */

try {
  // Load self-hosted Workbox modules explicitly
  importScripts('/workbox/workbox-sw.js');
  if (typeof workbox !== 'undefined') {
    workbox.setConfig({
      modulePathPrefix: '/workbox',
      debug: false,
    });
    // Explicitly preload essential modules from local files
    importScripts(
      '/workbox/workbox-core.prod.js',
      '/workbox/workbox-routing.prod.js',
      '/workbox/workbox-strategies.prod.js',
      '/workbox/workbox-expiration.prod.js',
      '/workbox/workbox-cacheable-response.prod.js',
      '/workbox/workbox-precaching.prod.js'
    );
  }
} catch (e) {
  try {
    // Fallback to official Google CDN if self-hosted path is unavailable
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');
  } catch (err) {
    console.error('[SW] Failed to load Workbox:', err);
  }
}

if (typeof workbox !== 'undefined') {
  console.log('[Workbox SW] Workbox loaded successfully. Initializing offline agricultural caching...');

  // Take control immediately on installation and updates
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Standardize cache names
  workbox.core.setCacheNameDetails({
    prefix: 'cabi-plant',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime',
  });

  // Precache list of essential shell assets and baseline database
  const PRECACHE_SHELL = [
    '/',
    '/api/database',
    '/output/database.json',
    '/manifest.json',
    '/icon.svg',
    '/apple-touch-icon.png',
    '/pwa-192x192.png',
    '/pwa-512x512.png',
    '/pwa-maskable-512x512.png',
    '/favicon.ico',
  ];

  // 1. CABI Diagnostic Database & API Endpoint: StaleWhileRevalidate
  // Critical for field use: Instant response from offline cache while fetching updates in background
  workbox.routing.registerRoute(
    ({ url }) =>
      url.pathname.startsWith('/api/database') ||
      url.pathname.includes('/output/database.json') ||
      url.pathname.endsWith('database.json'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cabi-database-cache-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days persistence for field guides
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 2. Authentic CABI Field Images & Specimens (both GitHub raw repository and local assets)
  // CacheFirst strategy: high-resolution agricultural disease photos are cached permanently for field inspection
  workbox.routing.registerRoute(
    ({ request, url }) =>
      request.destination === 'image' ||
      url.hostname === 'raw.githubusercontent.com' ||
      url.pathname.match(/\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/i),
    new workbox.strategies.CacheFirst({
      cacheName: 'cabi-specimen-photos-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 350,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 Days
          purgeOnQuotaError: true,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 3. Next.js Static Application Chunks & Styles (_next/static, css, js)
  workbox.routing.registerRoute(
    ({ request, url }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font' ||
      url.pathname.startsWith('/_next/static/'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cabi-static-assets-v1',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 120,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 4. Offline HTML Navigation: NetworkFirst with fallback to cached '/'
  const navigationStrategy = new workbox.strategies.NetworkFirst({
    cacheName: 'cabi-navigation-v1',
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  });

  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    async (params) => {
      try {
        const response = await navigationStrategy.handle(params);
        if (response) return response;
      } catch (err) {
        console.warn('[Workbox SW] Navigation offline fallback triggered:', err);
      }
      const fallback = await caches.match('/');
      if (fallback) return fallback;
      return new Response(
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>CABI Plant Assistant - Offline</title></head><body style="font-family:sans-serif;padding:2rem;text-align:center;background:#022c22;color:#ecfdf5"><h2>CABI Plant Diagnosis Guide</h2><p>You are currently offline in the field. Please ensure the app was opened at least once while online.</p><button onclick="window.location.reload()" style="padding:10px 20px;background:#059669;color:white;border:none;border-radius:8px;cursor:pointer">Retry Connection</button></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
  );

  // Precaching shell on install
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('cabi-precache-v1').then((cache) => {
        return cache.addAll(PRECACHE_SHELL).catch((err) => {
          console.warn('[Workbox SW] Precache non-blocking error:', err);
        });
      })
    );
  });

  // Handle client communication messages
  self.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
    if (event.data.type === 'CACHE_URLS' && Array.isArray(event.data.urls)) {
      caches.open('cabi-specimen-photos-v1').then((cache) => {
        cache.addAll(event.data.urls).catch((err) => {
          console.warn('[Workbox SW] Background specimen caching notice:', err);
        });
      });
    }
  });
} else {
  // Graceful standalone fallback if Workbox script could not be loaded
  self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
      caches.open('cabi-fallback-v1').then((cache) => {
        return cache.addAll(['/', '/api/database', '/output/database.json']).catch(() => {});
      })
    );
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request).catch(() => caches.match('/')))
    );
  });
}
