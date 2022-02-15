import React from 'react';
function Editer(props: {
  file: FileDescription;
  onChange: Function;
  theme: 'light' | 'dark' | 'realdark';
}) {
  const { file, onChange, theme } = props;

  return (
    <iframe style={{ width: '100%', height: '100%' }} src={file.url}></iframe>
  );
}

export default Editer;
