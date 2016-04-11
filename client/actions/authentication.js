import fetch from '../fetch'

export const GET_AUTHENTICATION = 'GET_AUTHENTICATION'
export const GET_AUTHENTICATION_SUCCESS = 'GET_AUTHENTICATION_SUCCESS'
export const GET_AUTHENTICATION_ERROR = 'GET_AUTHENTICATION_ERROR'

export function getAuthentication() {
  return dispatch => {
    dispatch({ type: GET_AUTHENTICATION })
    return fetch('/api/authentication')
      .then(res => res.json())
      .then(({ particleAccessToken, particleDeviceName }) => {
        dispatch({
          type: GET_AUTHENTICATION_SUCCESS,
          state: {
            particleAccessToken,
            particleDeviceName
          }
        })
      })
      .catch(() => {
        dispatch({
          type: GET_AUTHENTICATION_ERROR,
          error: true
        })
      })
  }
}

export const SET_AUTHENTICATION = 'SET_AUTHENTICATION'
export const SET_AUTHENTICATION_SUCCESS = 'SET_AUTHENTICATION_SUCCESS'
export const SET_AUTHENTICATION_ERROR = 'SET_AUTHENTICATION_ERROR'

export function setAuthentication(authentication) {
  return dispatch => {
    dispatch({ type: SET_AUTHENTICATION })
    return fetch('/api/authentication',
      {
        method: authentication ? 'post' : 'delete',
        body: authentication ? JSON.stringify(authentication) : null
      })
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: SET_AUTHENTICATION_SUCCESS,
          state: json
        })
      })
      .catch(() => {
        dispatch({
          type: SET_AUTHENTICATION_ERROR,
          error: true
        })
      })
  }
}
