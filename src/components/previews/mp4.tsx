import React from 'react';
function Editer(props: { file: FileDescription; onChange: Function }) {
  const { file, onChange } = props;

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
