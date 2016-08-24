import { browserHistory } from 'react-router'
import fetch from '../fetch'

export const TURN_TRANSMITTER = 'TURN_TRANSMITTER'
export const TURN_TRANSMITTER_SUCCESS = 'TURN_TRANSMITTER_SUCCESS'
export const TURN_TRANSMITTER_ERROR = 'TURN_TRANSMITTER_ERROR'

export function turnTransmitter(on) {
  return dispatch => {
    dispatch({
      type: TURN_TRANSMITTER,
      on
    })
    return fetch(`/api/transmitter/turn/${on ? 'on' : 'off'}`, { method: 'post' })
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: TURN_TRANSMITTER_SUCCESS,
          state: json
        })
      })
      .catch(() => {
        dispatch({
          type: TURN_TRANSMITTER_ERROR,
          error: true
        })
      })
  }
}

export const GET_TRANSMITTER = 'GET_TRANSMITTER'
export const GET_TRANSMITTER_SUCCESS = 'GET_TRANSMITTER_SUCCESS'
export const GET_TRANSMITTER_ERROR = 'GET_TRANSMITTER_ERROR'

export function getTransmitter() {
  return dispatch => {
    dispatch({ type: GET_TRANSMITTER })
    return fetch('/api/transmitter')
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: GET_TRANSMITTER_SUCCESS,
          state: json
        })
      })
      .catch(() => {
        dispatch({
          type: GET_TRANSMITTER_ERROR,
          error: true
        })
      })
  }
}

export const SET_TRANSMITTER = 'SET_TRANSMITTER'
export const SET_TRANSMITTER_SUCCESS = 'SET_TRANSMITTER_SUCCESS'
export const SET_TRANSMITTER_ERROR = 'SET_TRANSMITTER_ERROR'

export function setTransmitter(transmitter) {
  return dispatch => {
    dispatch({ type: SET_TRANSMITTER })
    return fetch('/api/transmitter',
      {
        method: 'post',
        body: JSON.stringify(transmitter)
      })
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: SET_TRANSMITTER_SUCCESS,
          state: json
        })
        browserHistory.push('/')
      })
      .catch(() => {
        dispatch({
          type: SET_TRANSMITTER_ERROR,
          error: true
        })
      })
  }
}
