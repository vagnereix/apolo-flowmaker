import { memo } from 'react';
import { getBezierPath } from 'reactflow';

import styles from './styles.module.scss';

function CustomEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: any) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const foreignObjectSize = 40;

  return (
    <>
      <path
        id={id}
        style={style}
        className='react-flow__edge-path'
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={150}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize}
        y={labelY - foreignObjectSize / 2}
        className='edgebutton-foreignobject'
        requiredExtensions='http://www.w3.org/1999/xhtml'
      >
        {label && (
          <main>
            <button
              title='Edge label'
              type='button'
              className={styles.edge_button}
              onClick={() => {}}
            >
              {label}
            </button>
          </main>
        )}
      </foreignObject>
    </>
  );
}

export const CustomEdge = memo(CustomEdgeComponent);
