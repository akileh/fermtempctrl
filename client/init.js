import 'react'
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import router from './router'
import './socketio'

injectTapEventPlugin()

render(
  router,
  document.getElementById('app')
)
