import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Devices from './devices'
import { getDevices, setDevice } from '../actions/device'

const mapStateToProps = ({ devices }) => {
  return { devices }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getDevices,
  setDevice
}, dispatch)

const DevicesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Devices)

export default DevicesContainer
