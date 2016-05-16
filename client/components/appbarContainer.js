import { connect } from 'react-redux'
import AppBar from './appbar'
import { toggleDrawer } from '../actions/drawer'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = dispatch => bindActionCreators({ toggleDrawer }, dispatch)

const AppBarContainer = connect(
  null,
  mapDispatchToProps
)(AppBar)

export default AppBarContainer
