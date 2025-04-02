// notification-worker.js
// Add version for cache management
const CACHE_VERSION = 'v2';

self.addEventListener('install', (event) => {
    console.log('Installing service worker...');
    // Skip caching specific files - just create the cache
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            console.log('Service worker installation complete');
            return Promise.resolve();
        }).catch(error => {
            console.error('Cache setup failed:', error);
        })
    );
    // Activate worker immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
    // Claim clients immediately
    event.waitUntil(self.clients.claim());
});

// Add proper error handling for push events
self.addEventListener('push', (event) => {
    console.log('Push event received');
    
    if (!event.data) {
        console.error('Push event received without data');
        return;
    }

    try {
        const data = event.data.json();
        console.log('Processing push notification:', data);

        // Create notification without requiring custom icons
        event.waitUntil(
            self.registration.showNotification(data.title || 'New Notification', {
                body: data.body || 'You have a new notification',
                data: data.data || {},
                requireInteraction: data.requireInteraction || false,
                silent: data.silent || false
                // No icons or actions to prevent errors
            })
        );
    } catch (error) {
        console.error('Error processing push notification:', error);
    }
});

// Add click handler for notifications
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked', event);

    try {
        // Close the notification
        event.notification.close();

        // Get the note ID from the notification data
        const noteId = event.notification.data?.noteId;
        console.log('Note ID from notification:', noteId);

        if (noteId) {
            // Open the appropriate URL based on the note ID
            const url = `/note/${noteId}`;

            event.waitUntil(
                clients.matchAll({type: 'window'}).then((clientList) => {
                    // Check if there's already a window open
                    for (const client of clientList) {
                        if (client.url === url && 'focus' in client) {
                            return client.focus();
                        }
                    }

                    // If no window is open with the URL, open a new one
                    if (clients.openWindow) {
                        return clients.openWindow(url);
                    }
                })
            );
        }
    } catch (error) {
        console.error('Error handling notification click:', error);
    }
});