import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Notifications from './notifications'
import {
  getNotificationStatus,
  setNotificationStatus,
  sendTestNotification
} from '../actions/notifications'

const mapStateToProps = ({ notifications }) => {
  return { notifications }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getNotificationStatus,
  setNotificationStatus,
  sendTestNotification
}, dispatch)

const NotificationsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications)

export default NotificationsContainer
