import {
  SET_STATUS,
  GET_STATUS,
  GET_STATUS_SUCCESS,
  GET_STATUS_ERROR
} from '../actions/status'
import { SET_TARGET_TEMPERATURE_SUCCESS } from '../actions/targetTemperature'
import { SET_CONTROLLED_SUCCESS } from '../actions/controlled'

function parseTemperature(temperature) {
  return temperature !== null && !isNaN(temperature) ? parseFloat(temperature).toFixed(1) : null
}

export default function status(state = { loading: true }, action) {
  switch (action.type) {
    case GET_STATUS:
      return Object.assign({ loading: true }, state, {
        loading: true,
        error: false
      })
    case GET_STATUS_SUCCESS:
    case SET_STATUS:
      return Object.assign(
        {
          loading: false,
          error: false
        },
        action.state,
        {
          temperature: parseTemperature(action.state.temperature),
          targetTemperature: parseTemperature(action.state.targetTemperature)
        }
      )
    case SET_TARGET_TEMPERATURE_SUCCESS:
      return Object.assign({}, state, {
        targetTemperature: parseTemperature(action.targetTemperature)
      })
    case SET_CONTROLLED_SUCCESS:
      return Object.assign({}, state, {
        controlled: action.controlled
      })
    case GET_STATUS_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.error
      })
    default:
      return state
  }
}
