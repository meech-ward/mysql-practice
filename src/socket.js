import mysqlDatabase from './database/mysqlDatabase'
import defaultDatabaseConfig from './database/defaultDatabaseConfig'
import { runSQL, removeConnections, makeConnections } from './database/databaseConnections'

export default async function(io) {

  const database = mysqlDatabase(defaultDatabaseConfig())

  io.on('connection', socket => { 
    console.log('connect')
    
    socket.on('create-database', async data => {

      const databaseData = await database.createRandomDatabase()
      socket.databaseData = databaseData
      await makeConnections({mysqlDatabase, databaseData, ids: data.ids})

      console.log(data)
      socket.emit('database-created')
    })

    socket.on('run-sql', async data => { 
      console.log('run-sql', data)

      try {
        const rows = await runSQL({databaseData: socket.databaseData, sql: data.sql, id: data.id})
        socket.emit('ran-sql', {rows, id: data.id})
      } catch (error) {
        socket.emit('error', {error, id: data.id})
      }
    })

    socket.on('transaction-details', async data => {
      console.log('transaction-details', data)

      try {
        const rows = await database.getTransactionDetails(socket.databaseData)
        socket.emit('ran-sql', {rows, id: data.id})
      } catch (error) {
        socket.emit('error', {error, id: data.id})
      }
    })

    socket.on('disconnect', () => { 
      console.log('disconnect')

      if (socket.databaseData) {
        database.removeDatabase(socket.databaseData)
        removeConnections(socket)
      }
     })
   })
}