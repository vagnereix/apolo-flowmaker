import { Position } from '@reactflow/core';
import { memo } from 'react';
import { Handle } from 'reactflow';

import styles from './styles.module.scss';

function CustomNodeComponent({ data, isConnectable, id }: any) {
  return (
    <>
      {data.firstNode ? (
        <></>
      ) : (
        <Handle
          type='target'
          className={`${styles.react_flow__handle} ${styles.react_flow__handle_top}`}
          position={Position.Top}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
      )}

      <input
        className='nodrag'
        type='text'
        onChange={(event) => data.onChange(event, id)}
        defaultValue={data.label}
      />

      <Handle
        className={`${styles.react_flow__handle} ${styles.react_flow__handle_bottom}`}
        type='source'
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </>
  );
}

export const CustomNode = memo(CustomNodeComponent);
