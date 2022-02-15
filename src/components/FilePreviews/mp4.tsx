import React from 'react';
function Editer(props: {
  file: FileDescription;
  onChange: Function;
  theme: 'light' | 'dark' | 'realdark';
}) {
  const { file, onChange, theme } = props;

  return (
    <video
      style={{ width: '100%', height: '100%' }}
      src={file.url}
      preload="metadata"
      controls
    ></video>
  );
}

export default Editer;
