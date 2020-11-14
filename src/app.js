import express from 'express'
import path from 'path'
import logger from 'morgan'

import databaseRouter from './routes/database'

import mysqlDatabase from './database/mysqlDatabase'
import defaultDatabaseConfig from './database/defaultDatabaseConfig'

export default async function() {
  const app = express()

  const database = mysqlDatabase(defaultDatabaseConfig())
  
  app.use(express.static(path.join(__dirname, '../public')))

  app.use(logger(':method :url :status :res[content-length] - :response-time ms'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(path.join(__dirname, '../public')))


  app.use('/api/database',databaseRouter({database}) )
  
  
  app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public/index.html'));
  })

  return app
}