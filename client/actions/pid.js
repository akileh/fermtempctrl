import fetch from '../fetch'

export const GET_PID = 'GET_PID'
export const GET_PID_SUCCESS = 'GET_PID_SUCCESS'
export const GET_PID_ERROR = 'GET_PID_ERROR'

export function getPid() {
  return dispatch => {
    dispatch({ type: GET_PID })
    return fetch('/api/pid')
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: GET_PID_SUCCESS,
          state: json
        })
      })
      .catch(() => {
        dispatch({
          type: GET_PID_ERROR,
          error: true
        })
      })
  }
}

export const SET_PID = 'SET_PID'
export const SET_PID_SUCCESS = 'SET_PID_SUCCESS'
export const SET_PID_ERROR = 'SET_PID_ERROR'

export function setPid(pid) {
  return dispatch => {
    dispatch({ type: SET_PID })
    return fetch('/api/pid',
      {
        method: 'post',
        body: JSON.stringify(pid)
      })
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: SET_PID_SUCCESS,
          state: json
        })
      })
      .catch(() => {
        dispatch({
          type: SET_PID_ERROR,
          error: true
        })
      })
  }
}
