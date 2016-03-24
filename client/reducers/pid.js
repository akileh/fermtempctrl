import {
  GET_PID,
  GET_PID_SUCCESS,
  GET_PID_ERROR,
  SET_PID,
  SET_PID_SUCCESS,
  SET_PID_ERROR
} from '../actions/pid'

export default function pid(state = {}, action) {
  switch (action.type) {
    case GET_PID:
    case SET_PID:
      return Object.assign({}, state, {
        loading: true,
        error: false
      })
    case GET_PID_SUCCESS:
    case SET_PID_SUCCESS:
      return action.state
    case GET_PID_ERROR:
    case SET_PID_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.error
      })
    default:
      return state
  }
}
