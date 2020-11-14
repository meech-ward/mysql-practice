export default function rowsToTable(rows) {
  let output = ''

  const metaRows = rows.filter(row => !!row.message)
  let dataRows = rows.filter(row => !row.message)
  let embedded = dataRows.filter(row => Array.isArray(row))
  let notEmbedded = dataRows.filter(row => !Array.isArray(row))
  dataRows = [notEmbedded, ...embedded]
  

  if (metaRows.length > 0) {
    output += metaRows.map(row => row.message).join('\n')
  }

  if (dataRows.length === 0) {
    return output
  }

  dataRows.forEach(dataRow => {

    if (typeof dataRow[0] !== 'object') {
      return
    }

    output += '<hr><table>'

    output += '<tr>' + Object.keys(dataRow[0]).map(key => `<th>${key}</th>`).join('') + '</tr>'

    output += 
    dataRow.map(row => 
      '<tr>' + Object.keys(row)
      .map(key => 
        `<td>${row[key]}</td>`)
      .join('')+ '</tr>' )
    .join('') 
    output + '</table><hr><br>'
  })

  return output
}
