import React from 'react';
import Editor from '@monaco-editor/react';
function Editer(props: { file: FileDescription; onChange: Function }) {
  const { file, onChange } = props;
  function handleEditorChange(value: any, event: any) {
    onChange(file, value);
  }
  return (
    <Editor
      height="100%"
      defaultLanguage="scss"
      defaultValue={typeof file.target === 'string' ? file.target : ''}
      theme="vs-dark"
      onChange={handleEditorChange}
    />
  );
}

export default Editer;
