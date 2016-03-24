import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'

class Authenticated extends React.Component {
  clearAuthentication() {
    this.props.setAuthentication({
      particleAccessToken: null,
      particleDeviceName: null
    })
  }
  render() {
    return (
      <div>
        <TextField
          floatingLabelText={'Device name'}
          disabled
          fullWidth
          defaultValue={this.props.authentication.particleDeviceName}
          />
        <RaisedButton
          label='Remove device'
          secondary
          onClick={() => this.clearAuthentication() }
          fullWidth
          />
      </div>
    )
  }
}

Authenticated.propTypes = {
  authentication: React.PropTypes.shape({
    particleDeviceName: React.PropTypes.string
  }),
  setAuthentication: React.PropTypes.func
}

export default Authenticated
