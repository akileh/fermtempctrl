import React from 'react'
import ReactHighcharts from 'react-highcharts'
import Content from './content'
import AppBarContainer from './appbarContainer'
import Error from './error'
import DropDownMenu from 'material-ui/lib/DropDownMenu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import Loading from './loading'

class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.getTemperatures = this.getTemperatures.bind(this)
    this.getTemperatures('day')
    this.state = {
      dateRange: 'day'
    }
  }
  onDateRangeChange(value) {
    if (this.state.dateRange !== value) {
      this.setState({ dateRange: value })
      this.getTemperatures(value)
    }
  }
  getTemperatures(from, to = Date.now()) {
    const now = Date.now()
    switch (from) {
      case 'day':
        return this.props.getTemperatures({
          from: now - 24 * 60 * 60 * 1000,
          to
        })
      case 'week':
        return this.props.getTemperatures({
          from: now - 7 * 24 * 60 * 60 * 1000,
          to
        })
      case 'month':
        return this.props.getTemperatures({
          from: now - 30 * 24 * 60 * 60 * 1000,
          to
        })
      default:
        return this.props.getTemperatures({ from, to })
    }
  }
  renderContent() {
    if (this.props.temperatures.loading) {
      return <Loading />
    }

    if (this.props.temperatures.error) {
      return <Error message='Failed to retrieve temperatures' />
    }

    const config = {
      chart: {
        type: 'area',
        zoomType: 'x'
      },
      title: {
        text: false
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: null
        },
        labels: {
          format: '{value} °C'
        }
      },
      series: [{
        name: 'Temperature',
        turboThreshold: 1,
        data: this.props.temperatures.data.map(({ createdAt, temperature }) => {
          return [createdAt, parseFloat(temperature.toFixed(1))]
        })
      }]
    }

    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <DropDownMenu
            value={this.state.dateRange}
            onChange={(event, index, value) => this.onDateRangeChange(value)}
            style={{ minWidth: 100 }}
            >
            <MenuItem
              value={'day'}
              primaryText='Day'
              />
            <MenuItem
              value={'week'}
              primaryText='Week'
              />
            <MenuItem
              value={'month'}
              primaryText='Month'
              />
          </DropDownMenu>
        </div>
        <ReactHighcharts config={config} />
      </div>
    )
  }
  render() {
    return (
      <div>
        <AppBarContainer />
        <Content>
          {this.renderContent()}
        </Content>
      </div>
    )
  }
}

Chart.propTypes = {
  temperatures: React.PropTypes.shape({
    data: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        temperature: React.PropTypes.number,
        targetTemperature: React.PropTypes.number,
        controlled: React.PropTypes.bool,
        status: React.PropTypes.number,
        createdAt: React.PropTypes.number
      })
    ),
    loading: React.PropTypes.bool,
    error: React.PropTypes.any
  }),
  getTemperatures: React.PropTypes.func
}

export default Chart
