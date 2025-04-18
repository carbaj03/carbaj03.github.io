// Firebase Service Worker for Push Notifications
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyCx7n3xoEDuNExFOwZ12GKfGbikqbBgc9A",
    authDomain: "cohesive-443220.firebaseapp.com",
    projectId: "cohesive-443220",
    storageBucket: "cohesive-443220.firebasestorage.app",
    messagingSenderId: "779478088692",
    appId: "1:779478088692:web:052def6dab53fd095457a1",
    measurementId: "G-G9FRMRPQ35"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);

    const {title, body, data} = payload.notification;
    const options = {
        body: body || '',
        icon: '/images/logo.svg',
        badge: '/images/logo.svg',
        data: data || {},
        tag: data?.tag || 'default',
        requireInteraction: true,
    };

    return self.registration.showNotification(title || 'Cohesive', options);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);

    event.notification.close();

    const noteId = event.notification.data?.noteId;
    const channel = event.notification.data?.channel;

    // Create URL with parameters to pass to the app
    let url = '/app';
    if (noteId) {
        url += `?noteId=${noteId}`;
    }
    if (channel) {
        url += `${noteId ? '&' : '?'}channel=${channel}`;
    }

    event.waitUntil(
        clients.matchAll({type: 'window'}).then((clientList) => {
            // If a window is already open, focus it and navigate
            for (const client of clientList) {
                if (client.url.includes('/app') && 'focus' in client) {
                    client.focus();
                    client.navigate(url);
                    return;
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});