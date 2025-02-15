// notification-worker.js
// Add version for cache management
const CACHE_VERSION = 'v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            return cache.addAll([
                '/icon.png',
                '/open-icon.png'
            ]);
        })
    );
});

// Add proper error handling for push events
self.addEventListener('push', (event) => {
    if (!event.data) {
        console.error('Push event received without data');
        return;
    }

    try {
        const data = event.data.json();
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: '/icon.png',
                data: data.data,
                requireInteraction: true,
                actions: [
                    {
                        action: 'open',
                        title: 'Open',
                        icon: '/open-icon.png'
                    }
                ]
            })
        );
    } catch (error) {
        console.error('Error processing push notification:', error);
    }
});