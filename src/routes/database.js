
import express from 'express'

export default function({database}) {
  const router = express.Router()

  router.get('/', async (req, res) => {

    let mysql 

    try {
      const connection = await database.status()
      mysql = {
        state: connection.state,
        host: connection.host,
        datbase: connection.database
      }
    } catch (err) {
      mysql = err
    }

    const data = {
      mysql
    }
    console.log(data)

    res.send(data)
  })

return router
}
