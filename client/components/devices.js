import React from 'react'
import Loading from './loading'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import { List, ListItem } from 'material-ui/List'
import RaisedButton from 'material-ui/RaisedButton'

class Devices extends React.Component {
  constructor(props) {
    super(props)
    this.props.getDevices()
  }
  render() {
    if (this.props.devices.error) {
      return <Error message='Failed to retrieve/save devices' />
    }

    if (this.props.devices.loading) {
      return <Loading />
    }

    return (
      <div>
        <p>Select device</p>
        <Paper zDepth={1}>
          <List>
            {this.props.devices.data.map((device, index, { length }) => {
              return (
                <div key={device}>
                  <ListItem
                    onTouchTap={() => this.props.setDevice(device) }
                    >
                    {device}
                  </ListItem>
                  {index < length - 1 ?
                    <Divider />
                  : null}
                </div>
              )
            })}
          </List>
        </Paper>
        <p>Or</p>
        <RaisedButton
          label='Clear authentication'
          secondary
          onClick={() => this.props.setAuthentication(null) }
          style={{ width: '100%' }}
          />
      </div>
    )
  }
}

Devices.propTypes = {
  devices: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.any,
    data: React.PropTypes.arrayOf(React.PropTypes.string)
  }),
  getDevices: React.PropTypes.func,
  setDevice: React.PropTypes.func,
  setAuthentication: React.PropTypes.func
}

export default Devices
