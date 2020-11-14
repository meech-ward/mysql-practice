const connections = {

}

export async function makeConnections({mysqlDatabase, databaseData, ids}) {
  connections[databaseData.name] = {}
  ids.forEach(id => {
    const database = mysqlDatabase({
      connectionLimit : 1,
      host     : process.env.MYSQL_HOST || 'localhost',
      user     : databaseData.name,
      password : databaseData.password,
      database : databaseData.name,
      multipleStatements: true
    })
    connections[databaseData.name][id] = database
  })
}

export function removeConnections({databaseData}) {
  delete connections[databaseData.name]
}

export async function runSQL({databaseData, sql, id}) {
  console.log({databaseData, sql, id})
  const database = connections[databaseData.name][id]
  return await database.run(sql)
}