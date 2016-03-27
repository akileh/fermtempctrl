import React from 'react'
import LeftNav from 'material-ui/lib/left-nav'
import { browserHistory } from 'react-router'
import List from 'material-ui/lib/lists/list'
import ListItem from 'material-ui/lib/lists/list-item'
import IconStatus from 'material-ui/lib/svg-icons/places/kitchen'
import IconTransmitter from 'material-ui/lib/svg-icons/action/settings-remote'
import IconParticle from 'material-ui/lib/svg-icons/hardware/memory'
import IconPid from 'material-ui/lib/svg-icons/image/tune'
import IconChart from 'material-ui/lib/svg-icons/action/timeline'
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider'
import theme from '../theme'

const routes = [
  {
    title: 'Status',
    path: '/',
    icon: <IconStatus />
  },
  {
    title: 'Chart',
    path: '/chart',
    icon: <IconChart />
  },
  {
    title: 'Pid',
    path: '/pid',
    icon: <IconPid />
  },
  {
    title: 'Transmitter',
    path: '/transmitter',
    icon: <IconTransmitter />
  },
  {
    title: 'Particle',
    path: '/particle',
    icon: <IconParticle />
  }
]

class App extends React.Component {
  selectItem(path) {
    browserHistory.push(path)
    this.props.toggleLeftNav()
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div>
          <LeftNav
            open={this.props.leftNavOpen}
            docked={false}
            onRequestChange={this.props.toggleLeftNav}
            >
            <List>
            {routes.map(route => {
              return (
                <ListItem
                  primaryText={route.title}
                  key={route.title}
                  leftIcon={route.icon}
                  onTouchTap={() => this.selectItem(route.path) }
                  />
              )
            })}
            </List>
          </LeftNav>
          <div>{this.props.children}</div>
        </div>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  leftNavOpen: React.PropTypes.bool,
  toggleLeftNav: React.PropTypes.func,
  children: React.PropTypes.object
}

export default App
