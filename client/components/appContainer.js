import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import App from './app'
import { toggleDrawer } from '../actions/drawer.js'

const mapStateToProps = ({ drawerOpen }) => {
  return {
    drawerOpen
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ toggleDrawer }, dispatch)

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer
