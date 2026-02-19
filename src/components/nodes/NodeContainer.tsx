import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

const handleCls = "!w-2.5 !h-2.5 !bg-muted-foreground !border-2 !border-background";

interface NodeContainerProps {
  title: string;
  icon: LucideIcon;
  selected?: boolean;
  colorClass?: string;
  children: React.ReactNode;
}

export function NodeContainer({
  title,
  icon: Icon,
  selected,
  colorClass,
  children,
}: NodeContainerProps) {
  return (
    <Card className={cn(
      "min-w-[200px] border-2 transition-all",
      selected ? "border-primary shadow-lg" : "border-muted shadow-sm",
    )}>
      {/* Four directional handles — each side acts as both source and target */}
      <Handle id="top-target"    type="target" position={Position.Top}    className={handleCls} />
      <Handle id="top-source"    type="source" position={Position.Top}    className={handleCls} />
      <Handle id="bottom-target" type="target" position={Position.Bottom} className={handleCls} />
      <Handle id="bottom-source" type="source" position={Position.Bottom} className={handleCls} />
      <Handle id="left-target"   type="target" position={Position.Left}   className={handleCls} />
      <Handle id="left-source"   type="source" position={Position.Left}   className={handleCls} />
      <Handle id="right-target"  type="target" position={Position.Right}  className={handleCls} />
      <Handle id="right-source"  type="source" position={Position.Right}  className={handleCls} />

      <CardHeader className="p-3 border-b bg-muted/30">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className={cn("w-4 h-4", colorClass)} />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3">
        {children}
      </CardContent>
    </Card>
  );
}

