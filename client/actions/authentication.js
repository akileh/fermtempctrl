import fetch from '../fetch'
import { browserHistory } from 'react-router'

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
        method: 'post',
        body: JSON.stringify(authentication)
      })
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: SET_AUTHENTICATION_SUCCESS,
          state: json
        })
        if (json.particleDeviceName) {
          browserHistory.push('/')
        }
      })
      .catch(() => {
        dispatch({
          type: SET_AUTHENTICATION_ERROR,
          error: true
        })
      })
  }
}
