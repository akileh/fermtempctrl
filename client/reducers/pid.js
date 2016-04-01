import {
  GET_PID,
  GET_PID_SUCCESS,
  GET_PID_ERROR,
  SET_PID,
  SET_PID_SUCCESS,
  SET_PID_ERROR
} from '../actions/pid'

import {
  SET_AUTOTUNE,
  SET_AUTOTUNE_SUCCESS,
  SET_AUTOTUNE_ERROR
} from '../actions/autotune'

export default function pid(state = {}, action) {
  switch (action.type) {
    case GET_PID:
    case SET_PID:
    case SET_AUTOTUNE:
      return Object.assign({}, state, {
        loading: true,
        error: false
      })
    case GET_PID_SUCCESS:
    case SET_PID_SUCCESS:
    case SET_AUTOTUNE_SUCCESS:
      return Object.assign({},
        state,
        action.state,
        {
          loading: false,
          error: false
        }
      )
    case GET_PID_ERROR:
    case SET_PID_ERROR:
    case SET_AUTOTUNE_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.error
      })
    default:
      return state
  }
}
