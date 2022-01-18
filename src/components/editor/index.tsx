import React from 'react';
import Editor from '@monaco-editor/react';
function Editer(props: { file: fileDescription }) {
  const { file } = props
  function handleEditorChange(value: any, event: any) {
    // here is the current value
  }

  // function handleEditorDidMount(editor: any, monaco: any) {
  //   console.log('onMount: the editor instance:', editor);
  //   console.log('onMount: the monaco instance:', monaco);
  // }

  // function handleEditorWillMount(monaco: any) {
  //   console.log('beforeMount: the monaco instance:', monaco);
  // }

  // function handleEditorValidation(markers: any) {
  //   // model markers
  //   // markers.forEach(marker => console.log('onValidate:', marker.message));
  // }

  return (
    <Editor
      height="90vh"
      defaultLanguage="html"
      defaultValue={typeof file.target === 'string' ? file.target : ''}
      theme="vs-dark"
      onChange={handleEditorChange}
      // onMount={handleEditorDidMount}
      // beforeMount={handleEditorWillMount}
      // onValidate={handleEditorValidation}
    />
  );
}

export default Editer;
