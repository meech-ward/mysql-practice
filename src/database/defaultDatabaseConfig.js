export default function defaultDatabaseConfig() {
  return {
    connectionLimit : 10,
    host     : process.env.MYSQL_HOST || 'localhost',
    user     : process.env.MYSQL_USERNAME || 'root',
    password : process.env.MYSQL_PASSWORD || '',
    database : process.env.MYSQL_DATABASE || '',
    multipleStatements: true
  }
}