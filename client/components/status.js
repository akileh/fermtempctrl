import React from 'react'
import ReactDOM from 'react-dom'
import Card from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import CardText from 'material-ui/lib/card/card-text'
import AppBarContainer from './appbarContainer'
import Content from './content'
import Error from './error'
import RaisedButton from 'material-ui/lib/raised-button'
import { Link } from 'react-router'
import moment from 'moment'
import Dialog from 'material-ui/lib/dialog'
import FlatButton from 'material-ui/lib/flat-button'
import TextField from 'material-ui/lib/text-field'
import Loading from './loading'
import Styles from 'material-ui/lib/styles'

const STATUS = {
  0: 'none',
  1: 'heating',
  2: 'cooling'
}

class Status extends React.Component {
  constructor(props) {
    super(props)
    this.props.getAuthentication()
    this.props.getStatus()
    this.state = {
      updatedAt: Date.now(),
      settingTargetTemperature: false
    }
  }
  componentWillMount() {
    this.forceRenderInterval = setInterval(() => {
      this.setState({ updateAt: Date.now() })
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.forceRenderInterval)
  }
  setTargetTemperature(event) {
    if (!event || !event.keyCode || event.keyCode === 13) {
      this.setState({ settingTargetTemperature: false })
      this.props.setTargetTemperature(this.refs.targetTemperature.getValue())
    }
  }
  renderControlButtons() {
    if (!this.props.authentication.particleDeviceName || !this.props.status.transmitterPaired) {
      return null
    }

    let turnLabel
    if (this.props.status.controlled) {
      turnLabel = this.props.controlled.loading ? 'Turning off' : 'Turn off'
    }
    else {
      turnLabel = this.props.controlled.loading ? 'Turning on' : 'Turn on'
    }

    return (
      <div>
        <RaisedButton
          primary
          label='Set target temperature'
          fullWidth
          onClick={() => this.setState({ settingTargetTemperature: true })}
          />
        <br /><br />
        <RaisedButton
          primary
          disabled={this.props.controlled.loading}
          label={turnLabel}
          fullWidth
          onClick={() => this.props.setControlled(!this.props.status.controlled)}
          />
      </div>
    )
  }
  renderSetupButtons() {
    return (
      <div>
        {!this.props.authentication.particleDeviceName ?
          <div style={{ textAlign: 'center' }}>
            <Link to='/particle'>
              <RaisedButton
                primary
                label='Setup device'
                fullWidth
                />
            </Link>
          </div>
        : null}
        {this.props.authentication.particleDeviceName && !this.props.status.transmitterPaired ?
          <div style={{ textAlign: 'center' }}>
            <Link to='/transmitter'>
              <RaisedButton
                primary
                label='Setup transmitter'
                fullWidth
                />
            </Link>
          </div>
        : null}
        <br />
      </div>
    )
  }
  renderContent() {
    if (this.props.authentication.loading || this.props.status.loading) {
      return <Loading />
    }

    if (this.props.authentication.error) {
      return <Error message='Failed to retrieve config' />
    }

    if (!this.props.authentication.particleDeviceName) {
      return (
        <Error
          message='Particle device not connected'
          showTitle={false}
          reload={false}
          >
          {this.renderSetupButtons()}
        </Error>
      )
    }

    if (this.props.status.error) {
      return <Error message='Failed connect to device' />
    }

    const now = Date.now()
    const createdAt = this.props.status.createdAt
    let targetTemperature
    // TODO to function
    if (isNaN(this.props.status.targetTemperature) || parseInt(this.props.status.targetTemperature, 10) === -127) {
      targetTemperature = '-'
    }
    else {
      targetTemperature = `${this.props.status.targetTemperature} °C`
    }
    // TODO to function
    let temperature
    if (isNaN(this.props.status.temperature) || parseInt(this.props.status.temperature, 10) === -127) {
      temperature = '-'
    }
    else {
      temperature = `${this.props.status.temperature} °C`
    }

    const isStatusStale = createdAt < (now - 20 * 1000)
    let title
    let subtitle
    if (this.props.status.loading) {
      title = 'Loading...'
      subtitle = '\u00a0'
    }
    else if (this.props.status.error) {
      title = 'Error loading status'
      subtitle = '\u00a0'
    }
    else {
      title = isStatusStale ? 'Waiting for up to date data..' : `Status: ${STATUS[this.props.status.status]}`
      if (isStatusStale) {
        subtitle = moment(createdAt).format('YYYY-MM-DD HH:mm:ss')
      }
      else {
        const diff = now - createdAt
        if (diff < 10000) {
          subtitle = 'Just now'
        }
        else {
          subtitle = `${parseInt(diff / 1000, 10)} seconds ago`
        }
      }
    }

    const actions = []
    actions.push(
      <FlatButton
        label='Cancel'
        onTouchTap={() => this.setState({ settingTargetTemperature: false })}
        />
    )
    actions.push(
      <FlatButton
        label={this.props.targetTemperature.loading ? 'Saving...' : 'Save'}
        disabled={this.props.targetTemperature.loading}
        primary
        onTouchTap={(event) => this.setTargetTemperature(event) }
        />
    )

    return (
      <div>
        {this.renderSetupButtons()}
        <Card>
          <CardTitle
            title={title}
            subtitle={subtitle}
            titleColor={isStatusStale ? Styles.Colors.red500 : null}
            />
          <CardText style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '18px' }}>Current temperature</span>
            <br />
            <span style={{ fontSize: '48px' }}>
              {temperature}
            </span>
            <br /><br />
            <span style={{ fontSize: '18px' }}>Target temperature</span>
            <br />
            <span style={{ fontSize: '48px' }}>
              {targetTemperature}
            </span>
          </CardText>
        </Card>
        <br />
        {this.renderControlButtons()}
        <Dialog
          title='Set target temperature'
          open={!!(this.state.settingTargetTemperature || this.props.targetTemperature.loading)}
          onRequestClose={() => this.setState({ settingTargetTemperature: false })}
          actions={actions}
          >
          <TextField
            autoFocus
            onFocus={() => {
              // move caret to end after focus
              setTimeout(() => {
                const nodes = ReactDOM.findDOMNode(this.refs.targetTemperature).getElementsByTagName('input')
                if (nodes.length > 0) {
                  const node = nodes[0]
                  window.foo = node
                  const length = node.value.length
                  node.setSelectionRange(length, length)
                }
              }, 0)
            }}
            ref='targetTemperature'
            defaultValue={this.props.status.targetTemperature}
            fullWidth
            onKeyDown={event => this.setTargetTemperature(event) }
            />
        </Dialog>
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

Status.propTypes = {
  getStatus: React.PropTypes.func,
  status: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.any,
    status: React.PropTypes.number,
    temperature: React.PropTypes.string,
    createdAt: React.PropTypes.number,
    targetTemperature: React.PropTypes.string,
    transmitterPaired: React.PropTypes.bool,
    controlled: React.PropTypes.bool
  }),
  getAuthentication: React.PropTypes.func,
  authentication: React.PropTypes.shape({
    particleDeviceName: React.PropTypes.string,
    loading: React.PropTypes.bool,
    error: React.PropTypes.any
  }),
  controlled: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.any
  }),
  setControlled: React.PropTypes.func,
  targetTemperature: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.any
  }),
  setTargetTemperature: React.PropTypes.func
}

export default Status
