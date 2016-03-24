import {
  SET_CONTROLLED,
  SET_CONTROLLED_SUCCESS,
  SET_CONTROLLED_ERROR
} from '../actions/controlled'

export default function controlled(state = {}, action) {
  switch (action.type) {
    case SET_CONTROLLED:
      return Object.assign({}, state, {
        loading: true,
        error: false
      })
    case SET_CONTROLLED_SUCCESS:
      return {
        controlled: action.controlled
      }
    case SET_CONTROLLED_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.error
      })
    default:
      return state
  }
}
