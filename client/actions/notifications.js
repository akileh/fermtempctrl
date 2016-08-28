import fetch from '../fetch'
import { getSubscription, getStatus, subscribe, unsubscribe } from '../push'

export const GET_NOTIFICATION_STATUS = 'GET_NOTIFICATION_STATUS'
export const GET_NOTIFICATION_STATUS_SUCCESS = 'GET_NOTIFICATION_STATUS_SUCCESS'
export const GET_NOTIFICATION_STATUS_ERROR = 'GET_NOTIFICATION_STATUS_ERROR'
export const SET_NOTIFICATION_STATUS = 'SET_NOTIFICATION_STATUS'
export const SET_NOTIFICATION_STATUS_SUCCESS = 'SET_NOTIFICATION_STATUS_SUCCESS'
export const SET_NOTIFICATION_STATUS_ERROR = 'SET_NOTIFICATION_STATUS_ERROR'

export function getNotificationStatus() {
  return dispatch => {
    dispatch({ type: GET_NOTIFICATION_STATUS })
    getStatus()
      .then(status => {
        dispatch({
          type: GET_NOTIFICATION_STATUS_SUCCESS,
          state: { status }
        })
      })
      .catch(err => {
        console.error(err) // eslint-disable-line no-console
        dispatch({
          type: GET_NOTIFICATION_STATUS_ERROR,
          state: { }
        })
      })
  }
}

export function setNotificationStatus() {
  return dispatch => {
    dispatch({
      type: SET_NOTIFICATION_STATUS,
      state: { status: 'enabled' }
    })
    getStatus()
      .then(status => {
        if (status === 'enabled') {
          unsubscribe()
            .then(() => dispatch({
              type: SET_NOTIFICATION_STATUS_SUCCESS,
              state: { status: 'disabled' }
            }))
            .catch(() => dispatch({
              type: SET_NOTIFICATION_STATUS_ERROR,
              state: { }
            }))
        }
        else if (status === 'disabled') {
          subscribe()
            .then(() => dispatch({
              type: SET_NOTIFICATION_STATUS_SUCCESS,
              state: { status: 'enabled' }
            }))
            .catch(err => {
              console.error(err) // eslint-disable-line no-console
              dispatch({
                type: SET_NOTIFICATION_STATUS_ERROR,
                state: { }
              })
            })
        }
        else {
          dispatch({
            type: SET_NOTIFICATION_STATUS,
            state: { status: 'denied' }
          })
        }
      })
  }
}

export function sendTestNotification() {
  return () => {
    getSubscription()
      .then(subscription => {
        fetch('/api/push/test',
          {
            method: 'post',
            body: JSON.stringify(subscription)
          })
      })
  }
}
