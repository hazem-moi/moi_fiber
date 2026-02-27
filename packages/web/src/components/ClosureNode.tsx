import { Group, Rect, Text } from 'react-konva';
import {
  NodeData,
  EdgeData,
  ClosureNodeData,
  TrayNodeData,
} from '@moi-fiber/shared';
import TrayNode from './TrayNode';

interface Props {
  closure: ClosureNodeData;
  nodes: NodeData[];
  edges: EdgeData[];
  onCreateSplice: (
    srcEp: string,
    tgtEp: string,
    trayId: string,
    sx: number,
    sy: number,
    tx: number,
    ty: number,
  ) => void;
}

export default function ClosureNode({ closure, nodes, edges, onCreateSplice }: Props) {
  const trays = nodes.filter(
    (n) => n.type === 'tray' && (n as TrayNodeData).parentId === closure.id,
  ) as TrayNodeData[];

  return (
    <Group x={closure.x} y={closure.y} draggable>
      {/* Background */}
      <Rect
        width={closure.width}
        height={closure.height}
        fill="#37474f"
        stroke="#546e7a"
        strokeWidth={2}
        cornerRadius={6}
      />
      {/* Title */}
      <Text
        text={closure.label ?? 'Closure'}
        x={8}
        y={8}
        fontSize={13}
        fill="#b0bec5"
        fontStyle="bold"
      />
      {/* Trays */}
      {trays.map((tray) => (
        <TrayNode
          key={tray.id}
          tray={tray}
          nodes={nodes}
          edges={edges}
          onCreateSplice={onCreateSplice}
        />
      ))}
    </Group>
  );
}
