import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import AppBarContainer from './appbarContainer.js'
import Content from './content'
import Loading from './loading'
import Error from './error'

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.props.getNotificationStatus()
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
  renderContent() {
    if (this.props.notifications.error) {
      return <Error message='Oops' />
    }
    else if (this.props.notifications.loading) {
      return <Loading />
    }
    else if (this.props.notifications.status === 'denied') {
      return (
        <span>Permission denied</span>
      )
    }
    else if (this.props.notifications.status === 'disabled') {
      return (
        <div>
          <RaisedButton
            primary
            label='Turn on push notifications'
            onClick={() => this.props.setNotificationStatus()}
            style={{ width: '100%' }}
            />
        </div>
      )
    }
    else {
      return (
        <div>
          <RaisedButton
            secondary
            label='Turn off push notifications'
            onClick={() => this.props.setNotificationStatus()}
            style={{ width: '100%' }}
            />
          <br/>
          <br/>
          <RaisedButton
            primary
            label='Send test push notification'
            onClick={() => this.props.sendTestNotification()}
            style={{ width: '100%' }}
            />
        </div>
      )
    }
  }
}

Notifications.propTypes = {
  getNotificationStatus: React.PropTypes.func,
  setNotificationStatus: React.PropTypes.func,
  sendTestNotification: React.PropTypes.func,
  notifications: React.PropTypes.object
}

export default Notifications
