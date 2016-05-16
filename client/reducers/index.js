import { combineReducers } from 'redux'
import status from './status'
import authentication from './authentication'
import transmitterTurned from './transmitterTurned'
import drawerOpen from './drawerOpen'
import controlled from './controlled'
import targetTemperature from './targetTemperature'
import pid from './pid'
import transmitter from './transmitter'
import temperatures from './temperatures'
import devices from './devices'
import rom from './rom'

export default combineReducers({
  status,
  authentication,
  transmitterTurned,
  drawerOpen,
  controlled,
  targetTemperature,
  pid,
  transmitter,
  temperatures,
  devices,
  rom
})
