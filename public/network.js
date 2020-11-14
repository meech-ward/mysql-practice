export function connectSocket() {
  const socket = io('ws://')

  socket.createDatabase = function(ids) {
    socket.emit('create-database', {ids})
  }

  socket.runSQL = function({sql, id}) {
    socket.emit('run-sql', {sql, id})
  }
  socket.getTransactionDetails = function({id}) {
    socket.emit('transaction-details', {id})
  }

  return socket 
}