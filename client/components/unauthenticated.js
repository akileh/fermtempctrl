import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

class Unauthenticated extends React.Component {
  constructor(props) {
    super(props)
    this.setAuthentication = this.setAuthentication.bind(this)
  }
  setAuthentication(event) {
    if (!event || !event.keyCode || event.keyCode === 13) {
      this.props.setAuthentication({
        accessToken: this.refs.accessToken.getValue().trim(),
        username: this.refs.username.getValue().trim(),
        password: this.refs.password.getValue().trim()
      })
    }
  }
  render() {
    return (
      <div>
        <TextField
          floatingLabelText={'Access token'}
          ref='accessToken'
          type='password'
          style={{ width: '100%' }}
          onKeyDown={event => this.setAuthentication(event)}
          />
        <p style={{ textAlign: 'center' }}>Or</p>
        <TextField
          floatingLabelText={'Username'}
          ref='username'
          type='text'
          style={{ width: '100%' }}
          onKeyDown={event => this.setAuthentication(event)}
          />
        <TextField
          floatingLabelText={'Password'}
          ref='password'
          type='password'
          style={{ width: '100%' }}
          onKeyDown={event => this.setAuthentication(event)}
          />
        <RaisedButton
          label='Save'
          primary
          onClick={this.setAuthentication}
          style={{ width: '100%' }}
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
