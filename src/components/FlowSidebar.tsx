import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Play, Terminal } from "lucide-react";

const NODE_TYPES = [
  {
    type: "start",
    label: "Start",
    icon: Play,
    color: "text-green-500",
  },
  {
    type: "input",
    label: "Input",
    icon: MessageSquare,
    color: "text-blue-500",
  },
  {
    type: "llm",
    label: "LLM Generation",
    icon: Terminal,
    color: "text-purple-500",
  },
  {
    type: "output",
    label: "Output",
    icon: MessageSquare,
    color: "text-orange-500",
  },
] as const;

export function FlowSidebar() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card className="h-full w-64 border-r border-t-0 border-b-0 rounded-none shadow-none bg-background">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-md">Node Types</CardTitle>
        <CardDescription>Drag nodes to the canvas</CardDescription>
      </CardHeader>
      <CardContent className="p-4 grid gap-3">
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            className="flex items-center gap-3 p-3 border rounded-lg cursor-grab hover:bg-accent/50 hover:border-primary/50 transition-all shadow-sm bg-card"
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
          >
            <node.icon className={`w-4 h-4 ${node.color}`} />
            <span className="text-sm font-medium">{node.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
