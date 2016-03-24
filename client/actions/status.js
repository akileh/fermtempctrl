import fetch from '../fetch'

export const GET_STATUS = 'GET_STATUS'
export const GET_STATUS_SUCCESS = 'GET_STATUS_SUCCESS'
export const GET_STATUS_ERROR = 'GET_STATUS_ERROR'
export const SET_STATUS = 'SET_STATUS'

export function getStatus() {
  return dispatch => {
    dispatch({ type: GET_STATUS })
    return fetch('/api/status')
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: GET_STATUS_SUCCESS,
          state: json
        })
      })
      .catch(() => {
        dispatch({
          type: GET_STATUS_ERROR,
          error: true
        })
      })
  }
}

export function setStatus(status) {
  return {
    type: SET_STATUS,
    state: status
  }
}
