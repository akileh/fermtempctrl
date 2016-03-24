import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Pid from './pid'
import { getPid, setPid } from '../actions/pid'

const mapStateToProps = ({ pid }) => {
  return { pid }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getPid,
  setPid
}, dispatch)

const PidContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Pid)

export default PidContainer
