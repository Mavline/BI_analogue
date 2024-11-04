import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { Paper, Typography } from '@mui/material';

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export function ProcessFlow({ data, entity }) {
  const createNodesAndEdges = () => {
    const nodes = [];
    const edges = [];

    if (entity.workCenters) {
      entity.workCenters.forEach((center, index) => {
        nodes.push({
          id: `${index}`,
          data: { label: center.name },
          position: { x: 0, y: 0 },
          style: {
            background: '#fff',
            border: '1px solid #777',
            borderRadius: '3px',
            padding: '10px',
            width: nodeWidth,
          },
        });

        if (index > 0) {
          edges.push({
            id: `e${index-1}-${index}`,
            source: `${index-1}`,
            target: `${index}`,
            animated: true,
          });
        }
      });
    }

    return getLayoutedElements(nodes, edges);
  };

  const { nodes: layoutedNodes, edges: layoutedEdges } = createNodesAndEdges();
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges]);

  return (
    <Paper sx={{ p: 2, position: 'relative', zIndex: 0 }}>
      <Typography variant="h6" gutterBottom>
        Processes: {entity.name}
      </Typography>
      <div style={{ height: 400 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </Paper>
  );
}