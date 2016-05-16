import {
  TOGGLE_DRAWER
} from '../actions/drawer'

export default function drawerOpen(state = false, action) {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return !state
    default:
      return state
  }
}
