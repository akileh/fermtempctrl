import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Status from './status'
import { getStatus } from '../actions/status'
import { getAuthentication } from '../actions/authentication'
import { setControlled } from '../actions/controlled'
import { setTargetTemperature } from '../actions/targetTemperature'
import { toggleLeftNav } from '../actions/leftNav'

const mapStateToProps = state => {
  return {
    status: state.status,
    authentication: state.authentication,
    controlled: state.controlled,
    targetTemperature: state.targetTemperature
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getStatus,
  getAuthentication,
  toggleLeftNav,
  setControlled,
  setTargetTemperature
}, dispatch)

const StatusContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Status)

export default StatusContainer
