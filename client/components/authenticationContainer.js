import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Authentication from './authentication'
import { getAuthentication, setAuthentication } from '../actions/authentication'

const mapStateToProps = ({ authentication }) => {
  return { authentication }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getAuthentication,
  setAuthentication
}, dispatch)

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Authentication)

export default AppContainer

