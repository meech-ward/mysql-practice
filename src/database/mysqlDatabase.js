import mysql from 'mysql'
import { v4 as uuid } from 'uuid'

export default function mysqlDatabase(dbDetails) {
  const connection = mysql.createPool(dbDetails)
  const exports = {}

  async function status() {
    return new Promise((resolve, reject) => {
      connection.getConnection(function(err, connection) {
        if (err) {
          reject(err)
          return
        }
        resolve({...connection, host: dbDetails.host, database: dbDetails.database})
        connection.end()
      });
    })
  }
  exports.status = status

  function end() {
    connection.end()
  }
  exports.end = end

  function run (sql) {
    return new Promise((resolve, reject) => {
      connection.query(sql, null, function (error, results, fields) {
        if (error) {
          reject(error); return
        }
        resolve(results)
      })
    })
  }
  exports.run = run

  exports.createRandomDatabase = async function () {
      const randomName = "db_" + uuid().replace(/-/g, '').substr(20)
      await run(`
      CREATE DATABASE ${randomName}
      `)
      await run(`
      CREATE USER '${randomName}'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MyNewPass4!';
      `)
      await run(`
      GRANT ALL PRIVILEGES ON ${randomName}.* TO '${randomName}'@'localhost';
      `)

      return {name: randomName, password: 'MyNewPass4!'}
  }

  exports.removeDatabase = async function ({name}) {
    await run(`
    DROP DATABASE ${name}
    `)
    await run(`
    DROP USER '${name}'@'localhost'
    `)
  }

  async function getTransactionDetails({name}) {
    return await run(`
    SELECT 
      trx_state as state,
      trx_started as started,
      trx_isolation_level as isolation_level,
      trx_rows_locked as rows_locked,
      trx_rows_modified as rows_modified
    FROM information_schema.INNODB_TRX
    JOIN information_schema.PROCESSLIST
    ON information_schema.PROCESSLIST.ID = information_schema.INNODB_TRX.trx_mysql_thread_id
    WHERE information_schema.PROCESSLIST.USER = '${name}';
    `)
  }
  exports.getTransactionDetails = getTransactionDetails

  return exports
}


  