import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Authenticated from './authenticated'
import { setDevice } from '../actions/device'
import { flashRom } from '../actions/rom'

const mapStateToProps = ({ devices }) => {
  return { devices }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  setDevice,
  flashRom
}, dispatch)

const AuthenticatedContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Authenticated)

export default AuthenticatedContainer
