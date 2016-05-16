import React from 'react'
import Drawer from 'material-ui/Drawer'
import { browserHistory } from 'react-router'
import { List, ListItem } from 'material-ui/List'
import IconStatus from 'material-ui/svg-icons/places/kitchen'
import IconTransmitter from 'material-ui/svg-icons/action/settings-remote'
import IconParticle from 'material-ui/svg-icons/hardware/memory'
import IconPid from 'material-ui/svg-icons/image/tune'
import IconChart from 'material-ui/svg-icons/action/timeline'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
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
    this.props.toggleDrawer()
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div>
          <Drawer
            open={this.props.drawerOpen}
            docked={false}
            onRequestChange={this.props.toggleDrawer}
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
          </Drawer>
          <div>{this.props.children}</div>
        </div>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  drawerOpen: React.PropTypes.bool,
  toggleDrawer: React.PropTypes.func,
  children: React.PropTypes.object
}

export default App
