import { useEffect, useState } from 'react';
import { Edge } from 'reactflow';
import styles from './styles.module.scss';

type ModalEditEdgeProps = {
  edgeSelected: Edge | undefined;
};

export function ModalEditEdge({ edgeSelected }: ModalEditEdgeProps) {
  const [v, setV] = useState<string>(edgeSelected!.label!.toString());

  useEffect(() => {
    setV(edgeSelected!.label!.toString());
  }, [edgeSelected]);

  useEffect(() => {
    edgeSelected!.label = v;
  }, [v]);

  return (
    <div className={styles.modal}>
      <label htmlFor='edge'>Edge Label {v}</label>

      <input
        name='edge'
        type='text'
        placeholder='Edit edge here'
        value={v}
        onChange={(e) => setV(e.target.value)}
      />

      <p>Unselect this edge to apply the changes</p>
    </div>
  );
}
