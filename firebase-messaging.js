// Firebase Messaging implementation
const messaging = firebase.messaging();

// Function to request permission and get FCM token
async function registerForPushNotifications() {
    try {
        // Check if service worker is supported
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker is not supported in this browser');
            return {error: 'no-service-worker-support'};
        }

        // Register the Firebase service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Firebase Service Worker registered:', registration);

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission denied');
            return {error: 'permission-denied'};
        }

        // Get FCM token
        // Note: useServiceWorker is no longer needed in newer Firebase versions
        // as it automatically uses the active service worker registration
        const token = await messaging.getToken({
            vapidKey: 'BHJqQde-2hYzVe3hTezS_uBKK-YZz9AHWOR26CijnmHzojDEa3xexqpvn1i-lt2cf2SscBrV4TyX4EwbihBhPzM', // Replace with your actual VAPID key from Firebase console
            serviceWorkerRegistration: registration
        });
        console.log('FCM token obtained:', token);

        // Set up message handler for foreground messages
        messaging.onMessage((payload) => {
            console.log('Message received in foreground:', payload);
            // You can display a custom notification here if needed
            const {title, body, data} = payload.notification;
            new Notification(title, {body, data});
        });

        return {
            subscription: token,
            endpoint: token
        };
    } catch (error) {
        console.error('Error registering for push notifications:', error);
        return {error: error.message};
    }
}

// Export functions for use in the app
window.webPushHelper = {
    registerForPushNotifications
};

// Initialize when the page loads
window.addEventListener('load', () => {
    console.log('Firebase Messaging initialized');
});