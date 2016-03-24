import {
  GET_AUTHENTICATION,
  GET_AUTHENTICATION_SUCCESS,
  GET_AUTHENTICATION_ERROR,
  SET_AUTHENTICATION,
  SET_AUTHENTICATION_SUCCESS,
  SET_AUTHENTICATION_ERROR
} from '../actions/authentication'

export default function authentication(state = {}, action) {
  switch (action.type) {
    case GET_AUTHENTICATION:
      return Object.assign({}, state, {
        loading: true,
        error: false
      })
    case SET_AUTHENTICATION:
      return Object.assign({}, state, {
        saving: true,
        error: false
      })
    case GET_AUTHENTICATION_SUCCESS:
    case SET_AUTHENTICATION_SUCCESS:
      return action.state
    case GET_AUTHENTICATION_ERROR:
    case SET_AUTHENTICATION_ERROR:
      return Object.assign({}, state, {
        loading: false,
        saving: false,
        error: action.error
      })
    default:
      return state
  }
}
