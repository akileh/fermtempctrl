export const GET_NOTIFICATION_STATUS = 'GET_NOTIFICATION_STATUS'
export const GET_NOTIFICATION_STATUS_SUCCESS = 'GET_NOTIFICATION_STATUS_SUCCESS'
export const GET_NOTIFICATION_STATUS_ERROR = 'GET_NOTIFICATION_STATUS_ERROR'
export const SET_NOTIFICATION_STATUS = 'SET_NOTIFICATION_STATUS'
export const SET_NOTIFICATION_STATUS_SUCCESS = 'SET_NOTIFICATION_STATUS_SUCCESS'
export const SET_NOTIFICATION_STATUS_ERROR = 'SET_NOTIFICATION_STATUS_ERROR'

function register() {
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => {
          if (reg.installing) {
            resolve()
          }
          else if (reg.waiting) {
            resolve()
          }
          else if (reg.active) {
            resolve()
          }
          else {
            reject(new Error('Service worker registration failed'))
          }
        })
    }
    else {
      reject(new Error('Service workers aren\'t supported in this browser.'))
    }
  })
}

export function getSubscription() {
  return navigator.serviceWorker.ready
      .then(reg => reg.pushManager.getSubscription())
}

export function subscribe() {
  return window.Notification.requestPermission()
    .then(() => navigator.serviceWorker.ready)
    .then(reg => reg.pushManager.subscribe({ userVisibleOnly: true }))
    // TODO send subscription to server
}

export function unsubscribe() {
  return getSubscription()
    .then(subscription => subscription.unsubscribe())
}

export function getStatus() {
  return register()
    .then(getSubscription)
    .then(subscription => {
      if (subscription) {
        return 'enabled'
      }
      else if (Notification.permission === 'denied') {
        return 'denied'
      }
      else {
        return 'disabled'
      }
    })
}

