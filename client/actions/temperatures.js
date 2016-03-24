import fetch from '../fetch'

export const GET_TEMPERATURES = 'GET_TEMPERATURES'
export const GET_TEMPERATURES_SUCCESS = 'GET_TEMPERATURES_SUCCESS'
export const GET_TEMPERATURES_ERROR = 'GET_TEMPERATURES_ERROR'

export function getTemperatures({ from, to }) {
  return dispatch => {
    dispatch({ type: GET_TEMPERATURES })
    return fetch(`/api/temperatures?from=${from}&to=${to}`)
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: GET_TEMPERATURES_SUCCESS,
          state: { data }
        })
      })
      .catch(() => {
        dispatch({
          type: GET_TEMPERATURES_ERROR,
          error: true
        })
      })
  }
}

