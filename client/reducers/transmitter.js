import {
  GET_TRANSMITTER,
  GET_TRANSMITTER_SUCCESS,
  GET_TRANSMITTER_ERROR,
  SET_TRANSMITTER,
  SET_TRANSMITTER_SUCCESS,
  SET_TRANSMITTER_ERROR
} from '../actions/transmitter'

export default function transmitter(state = {}, action) {
  switch (action.type) {
    case GET_TRANSMITTER:
      return Object.assign({}, state, {
        loading: true,
        error: false
      })
    case SET_TRANSMITTER:
      return Object.assign({}, state, {
        saving: true,
        error: false
      })
    case GET_TRANSMITTER_SUCCESS:
    case SET_TRANSMITTER_SUCCESS:
      return action.state
    case GET_TRANSMITTER_ERROR:
    case SET_TRANSMITTER_ERROR:
      return Object.assign({}, state, {
        loading: false,
        saving: false,
        error: action.error
      })
    default:
      return state
  }
}
