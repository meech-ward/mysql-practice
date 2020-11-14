import {setupEditors} from './editors.js'
import * as network from './network.js'
import rowsToTable from './rowsToTable.js'

$(() => {

  const editors = setupEditors()
  const socket = network.connectSocket()


  editors.forEach((editor, index) => {
    editor.onSubmit(function() {
      const sql = editor.getValue()
      editor.clear()
      editor.$editorPrevious.text(sql)
      console.log(index, {sql, id: index})
      socket.runSQL({sql, id: index})
    })
    editor.onTransaction(function() {
      socket.getTransactionDetails({id: index})
    })
  })


  socket.on('database-created', () => {
    console.log('database created')
  })

  
  socket.on('ran-sql', data => {
    editors[data.id].$editorOutput.html('')
    const table = rowsToTable(data.rows)
    editors[data.id].$editorOutput.html(table)
    console.log(data)
  })

  socket.on('error', data => {
    console.log(data)
    if (data.error.sqlMessage) {
      alert(data.error.sqlMessage)
    }
  })

  socket.createDatabase([0, 1])
})