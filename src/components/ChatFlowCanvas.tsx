import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowStore } from "@/store/flowStore";
import { useShallow } from "zustand/react/shallow";
import { useReactFlow, ReactFlowProvider } from "@xyflow/react";
import { v4 as uuidv4 } from 'uuid';

export function ChatFlowCanvas() {
  return (
    <ReactFlowProvider>
      <ChatFlowCanvasContent />
    </ReactFlowProvider>
  );
}

function ChatFlowCanvasContent() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useFlowStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      addNode: state.addNode,
    }))
  );
  
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { label: `${type} node` },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  return (
    <div
      data-component="CHAT_FLOW_CANVAS"
      className="w-full h-full"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
             <div className="bg-white p-2 rounded shadow-sm border text-xs text-gray-500">
                Canvas Ready
             </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
