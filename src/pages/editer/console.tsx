import { Badge, Tag } from 'antd';
import React from 'react';

function Console() {
  return (
    <div style={{ marginTop: '10px' }}>
      <Badge count={5}>
        <Tag  color="#55acee">
          Console
        </Tag>
      </Badge>
    </div>
  );
}

export default Console;
