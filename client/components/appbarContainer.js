import { connect } from 'react-redux'
import AppBar from './appbar'
import { toggleLeftNav } from '../actions/leftNav'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = dispatch => bindActionCreators({ toggleLeftNav }, dispatch)

const AppBarContainer = connect(
  null,
  mapDispatchToProps
)(AppBar)

export default AppBarContainer
