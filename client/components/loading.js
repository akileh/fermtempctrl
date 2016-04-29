import React from 'react'
import CircularProgress from 'material-ui/lib/circular-progress'

export default function Loading() {
  return (
    <div style={{ textAlign: 'center' }}>
      <CircularProgress />
    </div>
  )
}
