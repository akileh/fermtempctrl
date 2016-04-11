import fetch from '../fetch'

export const SET_CONTROLLED = 'SET_CONTROLLED'
export const SET_CONTROLLED_SUCCESS = 'SET_CONTROLLED_SUCCESS'
export const SET_CONTROLLED_ERROR = 'SET_CONTROLLED_ERROR'

export function setControlled(controlled) {
  return dispatch => {
    dispatch({ type: SET_CONTROLLED })
    return fetch('/api/state',
      {
        method: 'post',
        body: JSON.stringify({ controlled })
      })
      .then(res => res.json())
      .then(() => {
        dispatch({
          type: SET_CONTROLLED_SUCCESS,
          controlled
        })
      })
      .catch(() => {
        dispatch({
          type: SET_CONTROLLED_ERROR,
          error: true
        })
      })
  }
}
