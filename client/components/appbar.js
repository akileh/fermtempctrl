import React from 'react'
import AppBar from 'material-ui/lib/app-bar'

const App = props => {
  return (
    <AppBar
      title={window.app ? window.app.name : ''}
      showMenuIconButton
      onLeftIconButtonTouchTap={props.toggleLeftNav}
      style={{ flexWrap: 'wrap' }}
      >
      {props.children}
    </AppBar>
  )
}

App.propTypes = {
  toggleLeftNav: React.PropTypes.func,
  children: React.PropTypes.object
}

export default App

