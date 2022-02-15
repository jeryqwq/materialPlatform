import React from 'react';
import Editor from '@monaco-editor/react';
import Theme from '@/stores/Theme';
function Editer(props: {
  file: FileDescription;
  onChange: Function;
  theme: 'light' | 'dark' | 'realdark';
}) {
  const { file, onChange, theme } = props;
  function handleEditorChange(value: any, event: any) {
    onChange(file, value);
  }
  return (
    <Editor
      height="100%"
      defaultLanguage="html"
      defaultValue={typeof file.target === 'string' ? file.target : ''}
      theme={theme === 'light' ? 'light' : 'vs-dark'}
      onChange={handleEditorChange}
    />
  );
}

export default Editer;
