import { combineReducers } from 'redux'
import status from './status'
import authentication from './authentication'
import transmitterTurned from './transmitterTurned'
import leftNavOpen from './leftNavOpen'
import controlled from './controlled'
import targetTemperature from './targetTemperature'
import pid from './pid'
import transmitter from './transmitter'
import temperatures from './temperatures'

export default combineReducers({
  status,
  authentication,
  transmitterTurned,
  leftNavOpen,
  controlled,
  targetTemperature,
  pid,
  transmitter,
  temperatures
})
