import {
  GET_AUTHENTICATION,
  GET_AUTHENTICATION_SUCCESS,
  GET_AUTHENTICATION_ERROR,
  SET_AUTHENTICATION,
  SET_AUTHENTICATION_SUCCESS,
  SET_AUTHENTICATION_ERROR
} from '../actions/authentication'

import {
  SET_DEVICE_SUCCESS,
  SET_DEVICE_ERROR
} from '../actions/device'

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
    case SET_DEVICE_SUCCESS:
      return Object.assign({}, state, { saving: false, loading: false, error: false }, action.state)
    case GET_AUTHENTICATION_ERROR:
    case SET_AUTHENTICATION_ERROR:
    case SET_DEVICE_ERROR:
      return Object.assign({}, state, {
        loading: false,
        saving: false,
        error: action.error
      })
    default:
      return state
  }
}
