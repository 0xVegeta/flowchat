import { useCallback } from "react";
import { Plus } from "lucide-react";
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
import { useExecutionStore } from "@/store/executionStore";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { useReactFlow, ReactFlowProvider } from "@xyflow/react";
import { ChatNode } from "./nodes/FlowNodes";

const nodeTypes = {
  chat: ChatNode,
  llm: ChatNode,
};

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
      if (typeof type === 'undefined' || !type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: crypto.randomUUID(),
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
        onNodeClick={(_, node) => {
          useExecutionStore.getState().setActiveNodeId(node.id);
        }}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />

        {/* Empty state guide */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-dashed border-muted text-center max-w-sm">
              <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Build Your Flow</h3>
              <p className="text-sm text-muted-foreground">
                Click the + button to create a chat node and start your non-linear conversation.
              </p>
            </div>
          </div>
        )}

        {/* Floating create node button */}
        <Panel position="top-left" className="flex flex-col gap-2">
          <Button
            onClick={() => {
              const id = crypto.randomUUID();
              addNode({
                id,
                type: 'chat',
                position: { x: Math.random() * 300 + 50, y: Math.random() * 300 + 50 },
                data: { label: 'New Chat' },
              });
              useExecutionStore.getState().setActiveNodeId(id);
            }}
            className="shadow-md rounded-full w-12 h-12 p-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
