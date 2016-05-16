import React from 'react'
import AppBar from 'material-ui/AppBar'

const App = props => {
  return (
    <AppBar
      title={window.app ? window.app.name : ''}
      showMenuIconButton
      onLeftIconButtonTouchTap={props.toggleDrawer}
      >
      {props.children}
    </AppBar>
  )
}

App.propTypes = {
  toggleDrawer: React.PropTypes.func,
  children: React.PropTypes.object
}

export default App

