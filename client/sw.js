self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', event => {
  const { title, body } = event.data.json()
  event.waitUntil(
    self.registration.showNotification(title, { body })
  )
})

self.addEventListener('notificationclick', () => {
  if (self.clients.openWindow) {
    self.clients.openWindow('/')
  }
})
