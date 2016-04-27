import {
  FLASH_ROM,
  FLASH_ROM_SUCCESS,
  FLASH_ROM_ERROR
} from '../actions/rom'

export default function rom(state = {}, action) {
  switch (action.type) {
    case FLASH_ROM:
      return Object.assign({}, state, {
        saving: true,
        error: false
      })
    case FLASH_ROM_SUCCESS:
      return action.state
    case FLASH_ROM_ERROR:
      return Object.assign({}, state, {
        loading: false,
        saving: false,
        error: action.error
      })
    default:
      return state
  }
}
