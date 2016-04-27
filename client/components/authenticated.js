import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'

function Authenticated(props) {
  return (
    <div>
      <TextField
        floatingLabelText={'Device name'}
        disabled
        fullWidth
        defaultValue={props.authentication.particleDeviceName}
        />
      <RaisedButton
        label='Remove device'
        secondary
        onClick={() => props.setDevice(null) }
        fullWidth
        />
      <br />
      <br />
      <RaisedButton
        label='Clear authentication'
        secondary
        onClick={() => props.setAuthentication(null) }
        fullWidth
        />
      <br />
      <br />
      <RaisedButton
        label='Flash rom'
        primary
        onClick={() => {
          window.alert('flashing currently now working, flash manually (check README)') // eslint-disable-line no-alert
        }}
        fullWidth
        />
    </div>
  )
}

Authenticated.propTypes = {
  authentication: React.PropTypes.shape({
    particleDeviceName: React.PropTypes.string
  }),
  setAuthentication: React.PropTypes.func,
  setDevice: React.PropTypes.func,
  // TODO
  // flashRom: React.PropTypes.func
}

export default Authenticated
