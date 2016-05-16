import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

function Authenticated(props) {
  return (
    <div>
      <TextField
        floatingLabelText={'Device name'}
        disabled
        style={{ width: '100%' }}
        defaultValue={props.authentication.particleDeviceName}
        />
      <RaisedButton
        label='Remove device'
        secondary
        onClick={() => props.setDevice(null) }
        style={{ width: '100%' }}
        />
      <br />
      <br />
      <RaisedButton
        label='Clear authentication'
        secondary
        onClick={() => props.setAuthentication(null) }
        style={{ width: '100%' }}
        />
      <br />
      <br />
      <RaisedButton
        label='Flash rom'
        primary
        onClick={() => {
          window.alert('flashing currently now working, flash manually (check README)') // eslint-disable-line no-alert
        }}
        style={{ width: '100%' }}
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
