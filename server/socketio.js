import SocketIo from 'socket.io'

let io

export function initIo(server) {
  if (server) {
    io = SocketIo(server)
  }
  return io
}

export function emit(name, data) {
  if (io) {
    io.emit(name, data)
  }
}
