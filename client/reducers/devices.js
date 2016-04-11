import {
  GET_DEVICES,
  GET_DEVICES_SUCCESS,
  GET_DEVICES_ERROR,
  SET_DEVICE,
  SET_DEVICE_ERROR
} from '../actions/device'

export default function devices(state = { data: [] }, action) {
  switch (action.type) {
    case GET_DEVICES:
    case SET_DEVICE:
      return Object.assign({}, state, {
        loading: true,
        error: false
      })
    case GET_DEVICES_SUCCESS:
      return { data: action.state }
    case GET_DEVICES_ERROR:
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
