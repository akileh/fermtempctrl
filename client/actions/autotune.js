import fetch from '../fetch'

export const SET_AUTOTUNE = 'SET_AUTOTUNE'
export const SET_AUTOTUNE_SUCCESS = 'SET_AUTOTUNE_SUCCESS'
export const SET_AUTOTUNE_ERROR = 'SET_AUTOTUNE_ERROR'

export function setAutotune(state) {
  return dispatch => {
    dispatch({ type: SET_AUTOTUNE })
    return fetch(`/api/pid/autotune/${state}`,
      {
        method: 'post'
      })
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: SET_AUTOTUNE_SUCCESS,
          state: json
        })
      })
      .catch(() => {
        dispatch({
          type: SET_AUTOTUNE_ERROR,
          error: true
        })
      })
  }
}
