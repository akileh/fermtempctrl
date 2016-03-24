import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'

const Error = props => {
  return (
    <div>
      {props.showTitle ?
        <h1 style={{ textAlign: 'center' }}>Error</h1>
      : null}
      {props.message ?
        <p style={{ textAlign: 'center' }}>{props.message || 'Oops :('}</p>
      : null}
      {props.children ?
        props.children
      : null}
      {props.reload ?
        <RaisedButton
          label='Reload'
          primary
          fullWidth
          onClick={() => window.location.reload() }
          />
      : null}
    </div>
  )
}

Error.propTypes = {
  showTitle: React.PropTypes.bool,
  message: React.PropTypes.string,
  children: React.PropTypes.node,
  reload: React.PropTypes.bool
}

Error.defaultProps = {
  showTitle: true,
  reload: true
}

export default Error
