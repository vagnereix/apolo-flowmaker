import { ReactFlowProvider } from 'reactflow';
import { ApoloReactFlow } from './Components/ApoloReactFlow';

export function App() {
  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        margin: '0 auto',
      }}
    >
      <ReactFlowProvider>
        <ApoloReactFlow />
      </ReactFlowProvider>
    </main>
  );
}
