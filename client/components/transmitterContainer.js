import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Transmitter from './transmitter'
import { getAuthentication } from '../actions/authentication'
import {
  getTransmitter,
  setTransmitter,
  turnTransmitter
} from '../actions/transmitter'

const mapStateToProps = state => {
  return {
    authentication: state.authentication,
    transmitter: state.transmitter,
    transmitterTurned: state.transmitterTurned
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getAuthentication,
  getTransmitter,
  setTransmitter,
  turnTransmitter
}, dispatch)

const TransmitterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transmitter)

export default TransmitterContainer
