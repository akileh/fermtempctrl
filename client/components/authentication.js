import React from 'react'
import AppBarContainer from './appbarContainer'
import Content from './content'
import Unauthenticated from './unauthenticated'
import Authenticated from './authenticatedContainer'
import Error from './error'
import Loading from './loading'
import Devices from './devicesContainer'

class Authentication extends React.Component {
  constructor(props) {
    super(props)
    this.props.getAuthentication()
  }
  renderContent() {
    if (this.props.authentication.loading || this.props.authentication.saving) {
      return <Loading />
    }

    if (this.props.authentication.error) {
      return <Error message='Failed to retrieve/saving authentication' />
    }

    if (!this.props.authentication.particleAccessToken) {
      return <Unauthenticated {...this.props} />
    }
    else if (!this.props.authentication.particleDeviceName) {
      return <Devices {...this.props} />
    }
    else {
      return <Authenticated {...this.props} />
    }
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

Authentication.propTypes = {
  authentication: React.PropTypes.shape({
    particleAccessToken: React.PropTypes.bool,
    particleDeviceName: React.PropTypes.string,
    loading: React.PropTypes.bool,
    saving: React.PropTypes.bool,
    error: React.PropTypes.any
  }),
  getAuthentication: React.PropTypes.func
}

export default Authentication
