import { MessageSquare, Send, Loader2, Plus } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { type NodeProps } from '@xyflow/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { continueFlow } from '@/lib/engine';
import { useExecutionStore } from '@/store/executionStore';
import { useFlowStore } from '@/store/flowStore';
import { cn } from '@/lib/utils';

export function ChatNode({ selected, data, id }: NodeProps) {
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isProcessing, activeNodeId, messages } = useExecutionStore();
  const { addNode, onConnect } = useFlowStore();
  const isActive = activeNodeId === id;

  // All messages for this node
  const nodeMessages = messages
    .filter(m => m.nodeId === id)
    .sort((a, b) => a.timestamp - b.timestamp);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [nodeMessages.length]);

  const handleSend = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!text.trim() || isProcessing) return;

    useExecutionStore.getState().setActiveNodeId(id);

    if (!useExecutionStore.getState().sessionId) {
      useExecutionStore.getState().setSessionId(crypto.randomUUID());
    }

    continueFlow(text);
    setText('');
  };

  const spawnNode = (direction: 'top' | 'bottom' | 'left' | 'right') => {
    const node = useFlowStore.getState().nodes.find(n => n.id === id);
    if (!node) return;

    // Use measured dimensions from React Flow when available, fallback to estimates
    const parentW = node.measured?.width ?? node.width ?? 340;
    const parentH = node.measured?.height ?? node.height ?? 320;
    // New node has roughly the same dimensions
    const childW = parentW;
    const childH = parentH;

    const gap = 80; // gap between node edges
    const position = { ...node.position };

    if (direction === 'top') {
      // Center horizontally, place above
      position.x += (parentW - childW) / 2;
      position.y -= childH + gap;
    } else if (direction === 'bottom') {
      // Center horizontally, place below
      position.x += (parentW - childW) / 2;
      position.y += parentH + gap;
    } else if (direction === 'left') {
      // Center vertically, place to the left
      position.x -= childW + gap;
      position.y += (parentH - childH) / 2;
    } else if (direction === 'right') {
      // Center vertically, place to the right
      position.x += parentW + gap;
      position.y += (parentH - childH) / 2;
    }

    const newNodeId = crypto.randomUUID();
    addNode({
      id: newNodeId,
      type: 'chat',
      position,
      data: { label: 'New Chat' },
    });

    onConnect({
      source: id,
      target: newNodeId,
      sourceHandle: `${direction}-source`,
      targetHandle: direction === 'right' ? 'left-target'
                  : direction === 'left'  ? 'right-target'
                  : direction === 'bottom' ? 'top-target'
                  : 'bottom-target',
    });

    // Auto-focus the new node
    useExecutionStore.getState().setActiveNodeId(newNodeId);
  };

  // Shared button style — invisible until parent group is hovered via CSS
  const btnCls = "absolute pointer-events-auto bg-indigo-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-150 z-50 border-2 border-background";

  return (
    <div className="relative group">
      {/* TOP: centered horizontally, pushed above */}
      <button
        onClick={(e) => { e.stopPropagation(); spawnNode('top'); }}
        style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}
        className={btnCls}
        title="Add node above"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* BOTTOM: centered horizontally, pushed below */}
      <button
        onClick={(e) => { e.stopPropagation(); spawnNode('bottom'); }}
        style={{ bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }}
        className={btnCls}
        title="Add node below"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* LEFT: centered vertically, pushed left */}
      <button
        onClick={(e) => { e.stopPropagation(); spawnNode('left'); }}
        style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)' }}
        className={btnCls}
        title="Add node left"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* RIGHT: centered vertically, pushed right */}
      <button
        onClick={(e) => { e.stopPropagation(); spawnNode('right'); }}
        style={{ top: '50%', right: 0, transform: 'translate(50%, -50%)' }}
        className={btnCls}
        title="Add node right"
      >
        <Plus className="w-4 h-4" />
      </button>

      <NodeContainer
        title={typeof data.label === 'string' ? data.label : "Chat Session"}
        icon={MessageSquare}
        selected={selected}
        colorClass="text-indigo-500"
      >
        <div className="flex flex-col gap-3 min-w-[280px] max-w-[340px]">
          {/* Message Trail */}
          <div
            ref={scrollRef}
            className="bg-muted/50 rounded-md p-3 max-h-[200px] overflow-y-auto space-y-4 scroll-smooth"
          >
            {nodeMessages.length > 0 ? (
              nodeMessages.map((m) => (
                <div key={m.id} className="text-xs leading-relaxed">
                  <div className={cn(
                    "font-bold text-[10px] uppercase tracking-wider mb-1",
                    m.role === 'user' ? "text-muted-foreground/80" : "text-indigo-500"
                  )}>
                    {m.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div className={cn(
                    "p-2 rounded-lg",
                    m.role === 'user'
                      ? "bg-background/50 border border-muted"
                      : "bg-indigo-50/50 text-foreground"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground italic text-center py-4">
                Type below to start the conversation...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(e)}
              placeholder="Message AI..."
              className="h-10 text-xs bg-background border-muted-foreground/20 focus-visible:ring-indigo-500"
              disabled={isProcessing && isActive}
            />
            <Button
              size="icon"
              className="h-10 w-10 shrink-0 bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              onClick={handleSend}
              disabled={isProcessing && isActive}
            >
              {isProcessing && isActive ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                isActive ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"
              )} />
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                {isActive ? 'Active' : 'Idle'}
              </span>
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
              {nodeMessages.length} Messages
            </div>
          </div>
        </div>
      </NodeContainer>
    </div>
  );
}
