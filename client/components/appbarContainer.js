import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AppBar from './appbar'
import { toggleDrawer } from '../actions/drawer'

const mapDispatchToProps = dispatch => bindActionCreators({ toggleDrawer }, dispatch)

const AppBarContainer = connect(
  null,
  mapDispatchToProps
)(AppBar)

export default AppBarContainer
