import { useFlowStore } from '@/store/flowStore';
import { useExecutionStore } from '@/store/executionStore';
import { type Message } from './db';
import { generateAIResponse } from './llm';

export async function startFlow() {
  const flowStore = useFlowStore.getState();
  const execStore = useExecutionStore.getState();

  // Reset execution state
  execStore.resetExecution();
  const sessionId = crypto.randomUUID();
  execStore.setSessionId(sessionId);
  execStore.setIsProcessing(true);

  // Find Start Node or use active node
  let entryNode = flowStore.nodes.find((n) => n.type === 'start');
  
  if (!entryNode && execStore.activeNodeId) {
    entryNode = flowStore.nodes.find(n => n.id === execStore.activeNodeId);
  }

  if (!entryNode) {
    console.error('No start node or active node found');
    execStore.setIsProcessing(false);
    return;
  }

  // Start execution
  await processNode(entryNode.id);
}

export async function createBranch(sourceNodeId: string, messageId: string) {
  const flowStore = useFlowStore.getState();
  const execStore = useExecutionStore.getState();

  const sourceNode = flowStore.nodes.find(n => n.id === sourceNodeId);
  if (!sourceNode) return;

  const newNodeId = crypto.randomUUID();
  const newNode = {
    id: newNodeId,
    type: 'llm', // Default to LLM node for branching
    position: { 
      x: sourceNode.position.x + 250, 
      y: sourceNode.position.y + (flowStore.edges.filter(e => e.source === sourceNodeId).length * 100)
    },
    data: { label: 'New Branch' },
  };

  const newEdge = {
    id: crypto.randomUUID(),
    source: sourceNodeId,
    target: newNodeId,
    sourceHandle: null,
    targetHandle: null,
    data: { sourceMessageId: messageId },
  };

  flowStore.addNode(newNode);
  flowStore.onConnect(newEdge);

  // Switch to the new node
  execStore.setActiveNodeId(newNodeId);
  
  // Trigger processing if it's an LLM node
  await processNode(newNodeId);
}

export async function continueFlow(input: string) {
  const execStore = useExecutionStore.getState();
  const flowStore = useFlowStore.getState();
  const currentNodeId = execStore.activeNodeId;

  if (!currentNodeId) return;

  // Add user message to history
  const userMsg: Message = {
    id: crypto.randomUUID(),
    sessionId: execStore.sessionId!,
    role: 'user',
    content: input,
    nodeId: currentNodeId,
    timestamp: Date.now(),
  };
  execStore.addMessage(userMsg);

  execStore.setIsWaitingForInput(false);
  // Handle based on current node type
  const currentNode = flowStore.nodes.find(n => n.id === currentNodeId);
  
  if (currentNode?.type === 'llm' || currentNode?.type === 'chat') {
    // Re-process the node to get a response for the new input
    await processNode(currentNodeId);
    return;
  }

  // Find connections from the current node
  const outEdges = flowStore.edges.filter((e) => e.source === currentNodeId);
  if (outEdges.length === 0) {
    execStore.setIsProcessing(false);
    // Stay on current node for further chatting if desired, or at least don't clear it
    return;
  }

  // Move to next node
  const nextNodeId = outEdges[0].target;
  await processNode(nextNodeId);
}

async function processNode(nodeId: string) {
  const flowStore = useFlowStore.getState();
  const execStore = useExecutionStore.getState();

  execStore.setIsProcessing(true);
  execStore.setActiveNodeId(nodeId);

  const node = flowStore.nodes.find((n) => n.id === nodeId);
  if (!node) {
    execStore.setIsProcessing(false);
    return;
  }

  // Execute Node Logic
  try {
    switch (node.type) {
      case 'start':
        // No action, just pass through
        break;

      case 'input':
        // Wait for user input
        execStore.setIsWaitingForInput(true);
        execStore.setIsProcessing(false);
        return; // Stop recursion

      case 'llm':
      case 'chat':
        // Call LLM
        // Collect context from previous messages?
        // For now, let's just send the last user message or accumulated context
        const history = execStore.getMessagesForNode(nodeId, flowStore.edges);
        const response = await generateAIResponse(history, node.data);
        
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          sessionId: execStore.sessionId!,
          role: 'assistant',
          content: response,
          nodeId: nodeId,
          timestamp: Date.now(),
        };
        execStore.addMessage(aiMsg);
        
        // Stop recursion here for chat/llm nodes so responses don't "leak" to child nodes
        // The user can still follow the flow by interacting with the next node
        execStore.setIsProcessing(false);
        return;

      case 'output':
        // In a chat interface, 'output' nodes might just be final statements or formatting?
        // For now, maybe just log it or treat as end
        break;
        
      default:
        console.warn(`Unknown node type: ${node.type}`);
        break;
    }
  } catch (error) {
    console.error('Error processing node:', error);
    execStore.addMessage({
      id: crypto.randomUUID(),
      sessionId: execStore.sessionId!,
      role: 'system',
      content: `Error: ${(error as Error).message}`,
      nodeId: nodeId,
      timestamp: Date.now(),
    });
    execStore.setIsProcessing(false);
    return;
  }

  // Move to next node
  const outEdges = flowStore.edges.filter((e) => e.source === nodeId);
  
  if (outEdges.length === 0) {
    // End of flow
    execStore.setIsProcessing(false);
    // Don't clear activeNodeId, we want to stay focused on the current chat
    return;
  }

  // Artificial delay for UX
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Determine next node
  // If multiple edges, we might need logic (not implemented yet)
  const nextNodeId = outEdges[0].target;
  await processNode(nextNodeId);
}
