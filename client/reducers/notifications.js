import {
  GET_NOTIFICATION_STATUS,
  GET_NOTIFICATION_STATUS_SUCCESS,
  GET_NOTIFICATION_STATUS_ERROR,
  SET_NOTIFICATION_STATUS,
  SET_NOTIFICATION_STATUS_SUCCESS,
  SET_NOTIFICATION_STATUS_ERROR
}
from '../actions/notifications'

export default function notifications(state = { loading: true }, action) {
  switch (action.type) {
    case GET_NOTIFICATION_STATUS:
      return Object.assign({ loading: true, error: false }, action.state)
    case GET_NOTIFICATION_STATUS_SUCCESS:
      return Object.assign({ loading: false, error: false }, action.state)
    case GET_NOTIFICATION_STATUS_ERROR:
      return Object.assign({ loading: false, error: true }, action.state)
    case SET_NOTIFICATION_STATUS:
      return Object.assign({ loading: true, error: false }, action.state)
    case SET_NOTIFICATION_STATUS_SUCCESS:
      return Object.assign({ loading: false, error: false }, action.state)
    case SET_NOTIFICATION_STATUS_ERROR:
      return Object.assign({ loading: false, error: true }, action.state)
    default:
      return state
  }
}
