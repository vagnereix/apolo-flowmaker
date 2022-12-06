import { Position } from '@reactflow/core';
import { memo, useEffect } from 'react';
import { Handle } from 'reactflow';

import styles from './styles.module.scss';

function CustomNodeComponent({ data, isConnectable, id }: any) {
  useEffect(() => {
    const node = document.querySelector(`[data-testid='rf__node-${id}']`);

    if (data.source || data.target) {
      if (node?.classList.contains('source')) {
        data.source ? '' : node.classList.remove('source');

        data.target ? node.classList.add('target') : '';
      }

      if (node?.classList.contains('target')) {
        data.target ? '' : node.classList.remove('target');

        data.source ? node?.classList.add('source') : '';
      }

      data.source
        ? node?.classList.add('source')
        : node?.classList.add('target');
    } else {
      if (node?.classList.contains('source')) {
        node.classList.remove('source');
      }
      if (node?.classList.contains('target')) {
        node.classList.remove('target');
      }
    }
  }, [data]);

  return (
    <div>
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
        title='Node label'
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
    </div>
  );
}

export const CustomNode = memo(CustomNodeComponent);
