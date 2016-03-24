import {
  SET_TARGET_TEMPERATURE,
  SET_TARGET_TEMPERATURE_SUCCESS,
  SET_TARGET_TEMPERATURE_ERROR
} from '../actions/targetTemperature'

export default function targetTemperature(state = {}, action) {
  switch (action.type) {
    case SET_TARGET_TEMPERATURE:
      return Object.assign({}, state, {
        loading: true,
        error: false
      })
    case SET_TARGET_TEMPERATURE_SUCCESS:
      return {
        targetTemperature: action.targetTemperature
      }
    case SET_TARGET_TEMPERATURE_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.error
      })
    default:
      return state
  }
}
