import React from 'react'
import ReactHighcharts from 'react-highcharts'
import Content from './content'
import AppBarContainer from './appbarContainer'
import Error from './error'
import DropDownMenu from 'material-ui/lib/DropDownMenu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import Loading from './loading'
import Highcharts from 'highcharts'
import { browserHistory } from 'react-router'

Highcharts.setOptions({
  global: {
    useUTC: false
  }
})

class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.getTemperatures = this.getTemperatures.bind(this)
    this.state = {
      type: this.props.params.type || 'day'
    }
    this.getTemperatures({
      type: this.state.type,
      count: this.props.params.count || 1
    })
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.params.type !== nextProps.params.type ||
        this.props.params.count !== nextProps.params.count ||
        this.props.temperatures.loading !== nextProps.temperatures.loading ||
        this.props.temperatures.error !== nextProps.temperatures.error) {
      return true
    }
    else {
      return false
    }
  }
  onDateRangeChange(type, count) {
    if (this.state.type !== type) {
      this.setState({
        type,
        count
      })
      this.getTemperatures({ type, count })
    }
  }
  getTemperatures({ type = 'hour', count = 1 }) {
    browserHistory.replace(`/chart/${type}/${count}`)
    const now = Date.now()
    const to = now
    switch (type) {
      default:
      case 'hour':
        return this.props.getTemperatures({
          from: now - count * 60 * 60 * 1000,
          to
        })
      case 'day':
        return this.props.getTemperatures({
          from: now - count * 24 * 60 * 60 * 1000,
          to
        })
      case 'week':
        return this.props.getTemperatures({
          from: now - count * 7 * 24 * 60 * 60 * 1000,
          to
        })
      case 'month':
        return this.props.getTemperatures({
          from: now - count * 30 * 24 * 60 * 60 * 1000,
          to
        })
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
    // flatten all possible min/max values
    const temperatureReadings = [].concat.apply([],
      temperatures.map(({ temperature, targetTemperature }) => [temperature, targetTemperature])
    )
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
      tooltip: {
        shared: true,
        valueDecimals: 2
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
            return [createdAt, parseFloat(targetTemperature)]
          })
        },
        {
          name: 'Actual',
          type: 'area',
          fillOpacity: 0.5,
          turboThreshold: 1,
          color: '#FFD54F',
          data: temperaturesWithMissingData.map(({ createdAt, temperature }) => {
            return [createdAt, temperature ? parseFloat(temperature) : null]
          })
        },
        {
          name: 'Controlled',
          type: 'line',
          turboThreshold: 1,
          enableMouseTracking: false,
          color: '#81C784',
          linecap: 'square',
          lineWidth: 5,
          data: temperatures.map(({ createdAt, controlled }) => {
            return [createdAt, controlled ? maxTemperature : null]
          })
        },
        {
          name: 'Cooling',
          type: 'line',
          turboThreshold: 1,
          enableMouseTracking: false,
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
            value={this.state.type}
            onChange={(event, index, value) => this.onDateRangeChange(value, 1)}
            style={{ minWidth: 100 }}
            >
            <MenuItem
              value={'hour'}
              primaryText='Hour'
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
  getTemperatures: React.PropTypes.func,
  params: React.PropTypes.shape({
    type: React.PropTypes.string,
    count: React.PropTypes.count
  })
}

export default Chart
