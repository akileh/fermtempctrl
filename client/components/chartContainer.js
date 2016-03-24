import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Chart from './chart'
import { getTemperatures } from '../actions/temperatures'

const mapStateToProps = state => {
  return {
    temperatures: state.temperatures
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getTemperatures
}, dispatch)

const ChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Chart)

export default ChartContainer
