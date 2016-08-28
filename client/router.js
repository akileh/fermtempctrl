import React from 'react'
import { Provider } from 'react-redux'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import store from './store'
import AppContainer from './components/appContainer'
import StatusContainer from './components/statusContainer'
import TransmitterContainer from './components/transmitterContainer'
import AuthenticationContainer from './components/authenticationContainer'
import PidContainer from './components/pidContainer'
import ChartContainer from './components/chartContainer'
import NotificationsContainer from './components/notificationsContainer'

export default (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={AppContainer}>
        <IndexRoute component={StatusContainer} />
        <Route path='chart' component={ChartContainer} />
        <Route path='chart/:type/:count' component={ChartContainer} />
        <Route path='pid' component={PidContainer} />
        <Route path='transmitter' component={TransmitterContainer} />
        <Route path='particle' component={AuthenticationContainer} />
        <Route path='notifications' component={NotificationsContainer} />
      </Route>
    </Router>
  </Provider>
)
