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

  const foreignObjectSizeY = 40;
  const foreignObjectSizeX =
    label.length >= 41
      ? 215 // maior que 41
      : label.length <= 15
      ? label.length * 10
      : label.length * 7;

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
        width={foreignObjectSizeX}
        height={foreignObjectSizeY}
        x={
          foreignObjectSizeX ? labelX - foreignObjectSizeX / 2 : labelX - 40 / 2
        }
        y={labelY - foreignObjectSizeY / 2}
        className='edgebutton-foreignobject'
        requiredExtensions='http://www.w3.org/1999/xhtml'
      >
        {label && (
          <main>
            <button
              id='labelButton'
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
