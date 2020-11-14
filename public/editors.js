function aceEditor(editorId) {
  const editor = ace.edit(editorId)
  editor.setTheme("ace/theme/twilight");
  editor.session.setMode("ace/mode/sql");
  return editor
}

export function setupEditors() {
  const editors = Array.from($('.editor_container')).map($).map($container => {
    const $editor = $container.find('.editor')
    const editor = aceEditor($editor.attr('id'))
    const $submitButton = $container.find('.editor_submit')
    const $transactionButton = $container.find('.transaction_button')
    const $editorPrevious = $container.find('.editor_previous pre code')
    const $editorOutput = $container.find('.editor_output')
    return {
      $container,
      $editor,
      editor,
      $submitButton,
      $transactionButton,
      $editorPrevious,
      $editorOutput,
      onSubmit: (fn) => $submitButton.on('click', fn),
      onTransaction: (fn) => $transactionButton.on('click', fn),
      getValue: () => editor.getValue(),
      clear: () => editor.setValue(''),
    }
  })
  
  return editors 
}
