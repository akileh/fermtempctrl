import React from 'react'
import ReactHighcharts from 'react-highcharts'
import Content from './content'
import AppBarContainer from './appbarContainer'
import Error from './error'
import DropDownMenu from 'material-ui/lib/DropDownMenu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import Loading from './loading'
import Highcharts from 'highcharts'

Highcharts.setOptions({
  global: {
    useUTC: false
  }
})

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
      case 'hours':
        return this.props.getTemperatures({
          from: now - 6 * 60 * 60 * 1000,
          to
        })
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

    const temperatures = this.props.temperatures.data
    const temperatureReadings = temperatures.map(({ temperature }) => temperature)
    const minTemperature = Math.min(...temperatureReadings) - 2
    const maxTemperature = Math.max(...temperatureReadings) + 1

    // add empty data poins between too large intervals to make highchart not connect series between those points
    const missing = []
    this.props.temperatures.data.forEach((temperature, index) => {
      const nextTemperature = temperatures.length > index + 1 ? temperatures[index + 1] : null
      if (nextTemperature && nextTemperature.createdAt > temperature.createdAt + 5 * 60 * 1000) {
        missing.push({
          createdAt: temperature.createdAt + 1000
        })
      }
    })
    const temperaturesWithMissingData = temperatures.concat(missing).sort((a, b) => a.createdAt < b.createdAt ? -1 : 1)

    const config = {
      chart: {
        zoomType: 'x',
        spacingLeft: 0,
        spacingRight: 0
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
        },
        tickInterval: 1,
        allowDecimals: false,
        startOnTick: false,
        min: minTemperature,
        max: maxTemperature
      },
      series: [
        {
          name: 'Target',
          type: 'area',
          fillOpacity: 0.5,
          turboThreshold: 1,
          color: '#90A4AE',
          data: temperatures.map(({ createdAt, targetTemperature }) => {
            return [createdAt, parseFloat(targetTemperature.toFixed(1))]
          })
        },
        {
          name: 'Actual',
          type: 'area',
          fillOpacity: 0.5,
          turboThreshold: 1,
          color: '#FFD54F',
          data: temperaturesWithMissingData.map(({ createdAt, temperature }) => {
            return [createdAt, temperature ? parseFloat(temperature.toFixed(1)) : null]
          })
        },
        {
          name: 'Controlled',
          type: 'line',
          turboThreshold: 1,
          color: '#81C784',
          linecap: 'square',
          lineWidth: 5,
          data: temperatures
          .map(({ createdAt, controlled }) => {
            return [createdAt, controlled ? maxTemperature : null]
          })
        },
        {
          name: 'Cooling',
          type: 'line',
          turboThreshold: 1,
          color: '#4FC3F7',
          linecap: 'square',
          lineWidth: 20,
          data: temperatures.map(({ createdAt, status }) => {
            return [createdAt, status === 2 ? minTemperature : null]
          })
        }
      ]
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
              value={'hours'}
              primaryText='6 Hours'
              />
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
