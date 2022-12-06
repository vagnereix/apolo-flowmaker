import { MarkerType } from '@reactflow/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Edge,
  FitViewOptions,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import styles from './styles.module.scss';

import { CustomEdge } from '../CustomEdge';
import { CustomNode } from '../CustomNode';
import { DownloadButton } from '../DownloadButton';
import { ExportButton } from '../ExportButton';
import { ModalEditEdge } from '../ModalEditEdge';

type EdgesType = {
  id: string;
  data: { label: string };
  markerEnd: { type: string };
  source: string;
  target: string;
  type: string;
};

type NodesData = {
  firstNode?: boolean;
  label: string;
};

type CollectOptionsType = {
  pattern: string;
  type?: string;
  action: string;
  default?: boolean;
}[];

type QuickRepliesType = {
  title: string;
  payload: string;
  content_type: string;
}[];

type MountedNodesType = {
  topic: string;
  script:
    | [
        {
          text: string[];
          collect: {
            key: string;
            options: CollectOptionsType;
          };
          quick_replies: QuickRepliesType;
          meta: unknown[];
          action?: undefined;
          execute?: undefined;
        },
        (
          | {
              action: string;
              execute: {
                script: string;
                thread: string;
              };
            }
          | {}
        ),
        {
          action: string;
        }
      ]
    | [
        {
          text: string[];
        },
        {
          action: string;
        }
      ];
};

const nodeTypes = {
  customNode: CustomNode,
};
const edgeTypes = {
  customEdge: CustomEdge,
};

export function ApoloReactFlow() {
  const { project } = useReactFlow();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef(null);

  let id = 1;
  const getId = () => `${id++}`;

  const connectionLineStyle = { stroke: '#0007' };
  const fitViewOptions: FitViewOptions = {
    padding: 3,
  };

  function onChangeNode(event: any, id: string) {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const label = event.target.value;

          return {
            ...node,
            data: {
              ...node.data,
              label: label,
            },
          };
        }

        return {
          ...node,
        };
      })
    );
  }

  const initialNodes: Node[] = [
    {
      id: 'default',
      type: 'customNode',
      data: { label: 'Initial node', firstNode: true, onChange: onChangeNode },
      position: { x: 0, y: 50 },
    },
  ];

  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<NodesData>[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<EdgesType>[]>([]);
  const [edgeSelected, setEdgeSelected] = useState<Edge | undefined>(undefined);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []);

  // set edgeSelected where edges change
  useEffect(() => {
    setEdgeSelected(edges.find((e: Edge) => e.selected));

    setNodes((nds) =>
      nds.map((node) => {
        if (edgeSelected?.source === node.id) {
          return {
            ...node,
            data: {
              ...node.data,
              source: true,
              target: false,
            },
          };
        }

        if (edgeSelected?.target === node.id) {
          return {
            ...node,
            data: {
              ...node.data,
              source: false,
              target: true,
            },
          };
        }

        return {
          ...node,
          data: {
            ...node.data,
            source: false,
            target: false,
          },
        };
      })
    );
  }, [edges, edgeSelected]);

  // useEffect(() => {
  //   setNodes((nds) =>
  //     nds.map((node) => {
  //       if (edgeSelected?.source === node.id) {
  //         return {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             source: true,
  //             target: false,
  //           },
  //         };
  //       }

  //       if (edgeSelected?.target === node.id) {
  //         return {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             source: false,
  //             target: true,
  //           },
  //         };
  //       }

  //       return {
  //         ...node,
  //         data: {
  //           ...node.data,
  //           source: false,
  //           target: false,
  //         },
  //       };
  //     })
  //   );
  // }, [edgeSelected]);

  const onConnectEnd = useCallback(
    (event: any) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const wrapper = reactFlowWrapper.current;
        const { top, left } = wrapper!.getBoundingClientRect();
        const id = getId();

        const newNode = {
          id,
          type: 'customNode',
          // we are removing the half of the node width (75) to center the new node
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
          data: { label: `Node ${id}`, onChange: onChangeNode },
        };
        setNodes((nds: any) => nds.concat(newNode));

        const newEdge = {
          id,
          type: 'customEdge',
          source: connectingNodeId.current,
          target: id,
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelStyle: { fill: '#ffffff' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          label: '',
          data: {},
        };
        setEdges((eds: any) => eds.concat(newEdge));
      }
    },
    [project]
  );

  function getQuickRepliesFromNode(node: Node) {
    const quickReplies: { pattern: string; action: string }[] = [];

    edges.map((qReply) => {
      if (qReply.source === node.id) {
        quickReplies.push({
          pattern: qReply.label!.toString(),
          action: qReply.target,
        });
      }
    });

    return quickReplies;
  }

  function mountToExport() {
    const mountedNodes: MountedNodesType[] = nodes.map((node: Node) => {
      const quickReplies = getQuickRepliesFromNode(node);

      const collectOptions: CollectOptionsType = quickReplies.map((qR) => {
        return {
          pattern: qR.pattern, // TEXTO DE QUICK REPLY
          type: 'string',
          action: qR.action, // ID DE NÓ DESTINO
        };
      });

      return {
        topic: node.id,
        script: [
          {
            text: [node.data.label],
            collect: {
              // ESPERA UMA DETERMINADA RESPOSTA DO USUÁRIO
              key: 'question_1', // IDENTIFICADOR DA PERGUNTA
              options: collectOptions.concat({
                // REPETE A ÚLTIMA PERGUNTA CASO RECEBA UMA RESPOSTA INESPERADA
                // DEFINIR SE EXISTIRÁ EM TODOS OS CASOS OU EM NENHUM
                // POIS AS RESPOSTAS SÃO PRÉ DEFINIDAS
                default: true,
                pattern: 'defaut',
                action: 'next',
              }),
            },
            quick_replies: quickReplies.map((qR) => {
              return {
                title: qR.pattern,
                payload: qR.pattern,
                content_type: 'text',
              };
            }),
            meta: [], // O QUE É? SEMPRE DEVE EXISTIR? NÃO SABEMOS
          },
          quickReplies.length === 0
            ? {
                // PROVAVELMENTE SÓ EXISTE EM CASOS ESPECÍFICOS
                // USADO PARA CHAMAR UM FLUXO ESPECÍFICO, COMO O ENCERRAMENTO DE CONVERSA POR EXEMPLO
                // AO FINAL DA MENSAGEM SEM ESPERAR RESPOSTA DO USUÁRIO
                // SEMPRE DEVEM EXISTIR? *** NÃO, SOMENTE EM NÓS FOLHAS *** NÓS SEM QUICK REPLIES

                // action: 'execute_script',
                // execute: {
                // script: 'End_Conversation', // NOME DO FLUXO
                // thread: 'start', // NOME DO NÓ
                // },
                action: 'execute_script',
                execute: {
                  script: 'Flow name', // NOME DO FLUXO
                  thread: 'default', // NOME DO NÓ
                },
              }
            : {}, // POSSO DEIXAR UNDEFINED OU FALSE? ***
          {
            // PROVAVELMENTE SÓ EXISTE EM CASOS ESPECÍFICOS
            // USADO PARA CHAMAR UM SCRIPT PADRÃO, COMO O COMPLETE POR EXEMPLO
            // AO FINAL DA MENSAGEM SEM ESPERAR RESPOSTA DO USUÁRIO
            // SEMPRE DEVEM EXISTIR? NÃO SABEMOS
            action: 'complete',
          },
        ],
      };
    });

    const mountedFlow = [
      {
        command: 'Flow name',
        description: 'Flow description',
        script: mountedNodes.concat({
          topic: 'on_timeout',
          script: [
            {
              text: ['Looks like you got distracted. We can continue later.'],
            },
            {
              action: 'timeout',
            },
          ],
        }), // CONCATENAR COM O TOPIC DE TIMEOUT
        triggers: [
          // O QUE SÃO? SEMPRE DEVEM EXISTIR? SIM
          {
            type: 'string',
            pattern: 'Flow name',
          },
        ],
        variables: [
          // PRA QUE SERVEM? SEMPRE DEVEM EXISTIR? SIM
          {
            name: 'question_1',
            type: 'string',
          },
          {
            name: 'question_2',
            type: 'string',
          },
          {
            name: 'question_3',
            type: 'string',
          },
        ],
      },
      // {
      //   command: 'End_Conversation',
      //   description: 'End_Conversation',
      //   script: [
      //     {
      //       topic: 'default',
      //       script: [
      //         {
      //           text: [
      //             "Great! I'm so glad we could fix this for you. In case you need to refer to this later, I've saved this Service Request number for you",
      //           ],
      //         },
      //         {
      //           text: ['Have a good day'],
      //         },
      //         {
      //           action: 'start',
      //         },
      //       ],
      //     },
      //     {
      //       topic: 'on_timeout',
      //       script: [
      //         {
      //           text: ['Looks like you got distracted. We can continue later.'],
      //         },
      //         {
      //           action: 'timeout',
      //         },
      //       ],
      //     },
      //     {
      //       topic: 'start',
      //       script: [
      //         {
      //           text: ['How may I help you?'],
      //           quick_replies: [
      //             // TODO:
      //             // ADICIONAR OPÇÃO PARA O NOVO FLUXO
      //             {
      //               title: 'Flow name',
      //               payload: 'Flow name',
      //               content_type: 'text',
      //             },
      //           ],
      //           collect: {
      //             // TODO:
      //             // ADICIONAR OPÇÃO PARA O NOVO FLUXO
      //             key: 'question_1',
      //             options: [
      //               {
      //                 default: true,
      //                 pattern: 'default',
      //                 action: 'next',
      //               },
      //               {
      //                 pattern: 'Flow name', // PASSAR NOME DO FLUXO
      //                 type: 'string',
      //                 action: 'execute_script',
      //                 execute: {
      //                   script: 'Flow name', // PASSAR NOME DO FLUXO
      //                   thread: 'default', // PASSAR ID DO PRIMEIRO NÓ DO FLUXO
      //                 },
      //               },
      //             ],
      //           },
      //         },
      //         {
      //           action: 'complete',
      //         },
      //       ],
      //     },
      //   ],
      //   triggers: [
      //     {
      //       type: 'string',
      //       pattern: 'End_Conversation',
      //     },
      //   ],
      //   variables: [
      //     {
      //       name: 'question_1',
      //       type: 'string',
      //     },
      //     {
      //       name: 'question_2',
      //       type: 'string',
      //     },
      //     {
      //       name: 'question_3',
      //       type: 'string',
      //     },
      //   ],
      // },
    ];

    console.log(mountedFlow);
  }

  return (
    <div className={styles.wrapper} ref={reactFlowWrapper}>
      <div className={styles.buttons}>
        <DownloadButton />
        <ExportButton mountToExport={mountToExport} />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={fitViewOptions}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineStyle={connectionLineStyle}
      >
        {edgeSelected !== undefined && (
          <ModalEditEdge edgeSelected={edgeSelected} />
        )}

        <MiniMap
          pannable={true}
          nodeStrokeColor={(n: Node) => {
            return '#e1e1e1';
          }}
          nodeColor={(n: Node) => {
            return '#0672CB';
          }}
        />
        <Controls />
        <Background gap={15} />
      </ReactFlow>
    </div>
  );
}
