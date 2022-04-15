import React from 'react';

function VueDevTool(props: { vm: any }) {
  console.log(props.vm);
  return <div>VueDevTool</div>;
}

export default VueDevTool;
