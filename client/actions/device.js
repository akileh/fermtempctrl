import fetch from '../fetch'

export const GET_DEVICES = 'GET_DEVICES'
export const GET_DEVICES_SUCCESS = 'GET_DEVICES_SUCCESS'
export const GET_DEVICES_ERROR = 'GET_DEVICES_ERROR'

export function getDevices() {
  return dispatch => {
    dispatch({ type: GET_DEVICES })
    return fetch('/api/device')
      .then(res => res.json())
      .then(devices => {
        dispatch({
          type: GET_DEVICES_SUCCESS,
          state: devices
        })
      })
      .catch(() => {
        dispatch({
          type: GET_DEVICES_ERROR,
          error: true
        })
      })
  }
}

export const SET_DEVICE = 'SET_DEVICE'
export const SET_DEVICE_SUCCESS = 'SET_DEVICE_SUCCESS'
export const SET_DEVICE_ERROR = 'SET_DEVICE_ERROR'

export function setDevice(device) {
  return dispatch => {
    dispatch({ type: SET_DEVICE })
    return fetch('/api/device',
      {
        method: device ? 'post' : 'delete',
        body: JSON.stringify({ device })
      })
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: SET_DEVICE_SUCCESS,
          state: json
        })
      })
      .catch(() => {
        dispatch({
          type: SET_DEVICE_ERROR,
          error: true
        })
      })
  }
}
