import {
  TURN_TRANSMITTER,
  TURN_TRANSMITTER_SUCCESS,
  TURN_TRANSMITTER_ERROR
} from '../actions/transmitter'

export default function transmitterTurned(state = {}, action) {
  switch (action.type) {
    case TURN_TRANSMITTER:
      return {
        loading: true,
        error: false,
        on: action.on
      }
    case TURN_TRANSMITTER_SUCCESS:
      return {
        loading: false,
        error: false
      }
    case TURN_TRANSMITTER_ERROR:
      return {
        loading: false,
        error: true
      }
    default:
      return state
  }
}
