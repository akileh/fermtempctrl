import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'

class Unauthenticated extends React.Component {
  constructor(props) {
    super(props)
    this.sendAuthentication = this.sendAuthentication.bind(this)
  }
  sendAuthentication(event) {
    if (!event || !event.keyCode || event.keyCode === 13) {
      this.props.setAuthentication({
        particleAccessToken: this.refs.accessToken.getValue().trim(),
        particleDeviceName: this.refs.deviceName.getValue().trim()
      })
    }
  }
  render() {
    return (
      <div>
        <TextField
          autoFocus
          floatingLabelText={'Device name'}
          ref='deviceName'
          fullWidth
          onKeyDown={event => this.sendAuthentication(event)}
          />
        <TextField
          floatingLabelText={'Access token'}
          ref='accessToken'
          type='password'
          fullWidth
          onKeyDown={event => this.sendAuthentication(event)}
          />
        <RaisedButton
          label='Save device'
          primary
          onClick={this.sendAuthentication}
          fullWidth
          />
      </div>
    )
  }
}

Unauthenticated.propTypes = {
  authentication: React.PropTypes.shape({
    particleDeviceName: React.PropTypes.string
  }),
  setAuthentication: React.PropTypes.func
}

export default Unauthenticated
