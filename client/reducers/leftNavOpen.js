import {
  TOGGLE_LEFTNAV
} from '../actions/leftNav'

export default function leftNavOpen(state = false, action) {
  switch (action.type) {
    case TOGGLE_LEFTNAV:
      return !state
    default:
      return state
  }
}
