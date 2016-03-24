import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import App from './app'
import { toggleLeftNav } from '../actions/leftNav'

const mapStateToProps = ({ leftNavOpen }) => {
  return {
    leftNavOpen
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ toggleLeftNav }, dispatch)

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer
