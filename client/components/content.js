import React from 'react'

const Content = props => {
  return (
    <div style={{ padding: 16 }}>
      {props.children}
    </div>
  )
}

Content.propTypes = {
  children: React.PropTypes.object
}

export default Content
