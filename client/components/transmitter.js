import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import { browserHistory } from 'react-router'
import AppBarContainer from './appbarContainer'
import Content from './content'
import Error from './error'
import { Link } from 'react-router'
import Loading from './loading'

class Transmitter extends React.Component {
  constructor(props) {
    super(props)
    this.props.getAuthentication()
    this.props.getTransmitter()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.saving && !nextProps.authentication.saving && !nextProps.authentication.error) {
      browserHistory.push('/')
    }
  }
  renderContent() {
    if (this.props.authentication.loading || this.props.transmitter.loading || this.props.transmitter.saving) {
      return <Loading />
    }

    if (this.props.authentication.error) {
      return <Error message='Failed to retrieve config' />
    }

    if (!this.props.authentication.particleDeviceName) {
      return (
        <Error
          message='Device has not been set up yet'
          reload={false}
          >
          <div style={{ textAlign: 'center' }}>
            <Link to='/particle'>
              <RaisedButton
                primary
                label='Setup device'
                />
            </Link>
          </div>
        </Error>
      )
    }

    if (this.props.transmitter.error) {
      return <Error message='Failed to retrieve/saving transmitter config' />
    }

    const waitingOn = this.props.transmitterTurned.loading && this.props.transmitterTurned.on
    const waitingOff = this.props.transmitterTurned.loading && !this.props.transmitterTurned.on

    return (
      <div>
        <RaisedButton
          label={waitingOn ? 'Waiting...' : 'Pair/Turn On'}
          disabled={this.props.transmitterTurned.loading}
          onClick={() => this.props.turnTransmitter(true)}
          style={{ width: '45%' }}
          />
        <RaisedButton
          label={waitingOff ? 'Waiting...' : 'Pair/Turn Off'}
          disabled={this.props.transmitterTurned.loading}
          onClick={() => this.props.turnTransmitter(false)}
          style={{ width: '45%', float: 'right' }}
          />
        <br /><br />
        <RaisedButton
          label='Everything works'
          primary
          onClick={() => this.props.setTransmitter({ transmitterPaired: true })}
          fullWidth
          />
        <br /><br />
        <RaisedButton
          label={'It doesn\'t work'}
          secondary
          onClick={() => this.props.setTransmitter({ transmitterPaired: false })}
          fullWidth
          />
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

Transmitter.propTypes = {
  authentication: React.PropTypes.shape({
    particleDeviceName: React.PropTypes.string,
    loading: React.PropTypes.bool,
    saving: React.PropTypes.bool,
    error: React.PropTypes.any
  }),
  transmitter: React.PropTypes.shape({
    transmitterPaired: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    saving: React.PropTypes.bool,
    error: React.PropTypes.any
  }),
  transmitterTurned: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.any,
    on: React.PropTypes.bool
  }),
  getAuthentication: React.PropTypes.func,
  getTransmitter: React.PropTypes.func,
  setTransmitter: React.PropTypes.func,
  turnTransmitter: React.PropTypes.func
}

export default Transmitter
