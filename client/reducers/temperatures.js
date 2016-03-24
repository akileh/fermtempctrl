import {
  GET_TEMPERATURES,
  GET_TEMPERATURES_SUCCESS,
  GET_TEMPERATURES_ERROR
} from '../actions/temperatures'

export default function temperatures(state = { data: [], loading: true }, action) {
  switch (action.type) {
    case GET_TEMPERATURES:
      return Object.assign({}, state, {
        loading: true,
        error: false
      })
    case GET_TEMPERATURES_SUCCESS:
      return action.state
    case GET_TEMPERATURES_ERROR:
      return Object.assign({}, state, {
        loading: false,
        saving: false,
        error: action.error
      })
    default:
      return state
  }
}
