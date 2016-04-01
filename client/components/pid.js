import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import TextField from 'material-ui/lib/text-field'
import AppBarContainer from './appbarContainer'
import Content from './content'
import Error from './error'
import Loading from './loading'

class Pid extends React.Component {
  constructor(props) {
    super(props)
    this.props.getPid()
  }
  setPid() {
    this.props.setPid({
      p: parseFloat(this.refs.p.getValue()),
      i: parseFloat(this.refs.i.getValue()),
      d: parseFloat(this.refs.d.getValue())
    })
  }
  renderContent() {
    if (this.props.pid.loading) {
      return <Loading />
    }

    if (this.props.pid.error) {
      return <Error message='Failed to set/get pid/autotune' />
    }

    return (
      <div>
        <TextField
          floatingLabelText='P'
          disabled={this.props.pid.tuning}
          ref='p'
          fullWidth
          defaultValue={this.props.pid.p}
          />
        <TextField
          floatingLabelText='I'
          disabled={this.props.pid.tuning}
          ref='i'
          fullWidth
          defaultValue={this.props.pid.i}
          />
        <TextField
          floatingLabelText='D'
          disabled={this.props.pid.tuning}
          ref='d'
          fullWidth
          defaultValue={this.props.pid.d}
          />
        <RaisedButton
          label='Save'
          disabled={this.props.pid.tuning}
          primary
          onClick={() => this.setPid()}
          fullWidth
          />
        <br />
        <br />
        <RaisedButton
          label={this.props.pid.tuning ? 'Stop autotune' : 'Start autotune'}
          primary
          onClick={() => this.props.setAutotune(this.props.pid.tuning ? 'off' : 'on')}
          fullWidth
          />
      </div>
    )
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

Pid.propTypes = {
  pid: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.any,
    p: React.PropTypes.number,
    i: React.PropTypes.number,
    d: React.PropTypes.number,
    tuning: React.PropTypes.bool
  }),
  getPid: React.PropTypes.func,
  setPid: React.PropTypes.func,
  setAutotune: React.PropTypes.func
}

export default Pid
