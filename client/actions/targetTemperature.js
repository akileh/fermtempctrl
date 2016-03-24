import fetch from '../fetch'

export const SET_TARGET_TEMPERATURE = 'SET_TARGET_TEMPERATURE'
export const SET_TARGET_TEMPERATURE_SUCCESS = 'SET_TARGET_TEMPERATURE_SUCCESS'
export const SET_TARGET_TEMPERATURE_ERROR = 'SET_TARGET_TEMPERATURE_ERROR'

export function setTargetTemperature(targetTemperature) {
  return dispatch => {
    dispatch({ type: SET_TARGET_TEMPERATURE })
    return fetch('/api/device',
      {
        method: 'post',
        body: JSON.stringify({ targetTemperature })
      })
      .then(res => res.json())
      .then(() => {
        dispatch({
          type: SET_TARGET_TEMPERATURE_SUCCESS,
          targetTemperature
        })
      })
      .catch(() => {
        dispatch({
          type: SET_TARGET_TEMPERATURE_ERROR,
          error: true
        })
      })
  }
}
