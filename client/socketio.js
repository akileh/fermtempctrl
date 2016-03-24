import socketIoClient from 'socket.io-client'
import { setStatus } from './actions/status'
import store from './store'

const socket = socketIoClient(window.location.host)
socket.on('status', status => {
  store.dispatch(setStatus(status))
})
