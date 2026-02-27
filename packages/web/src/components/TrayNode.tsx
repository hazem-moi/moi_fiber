import { Group, Rect, Text, Line } from 'react-konva';
import { useState, useRef } from 'react';
import Konva from 'konva';
import {
  NodeData,
  EdgeData,
  TrayNodeData,
  CableEndNodeData,
  SpliceEdgeData,
} from '@moi-fiber/shared';
import { parseEndpointId } from '@moi-fiber/shared';
import CableEndNode from './CableEndNode';

const TIA_COLORS = [
  '#0000FF', '#FFA500', '#008000', '#A52A2A',
  '#708090', '#FFFFFF', '#FF0000', '#000000',
  '#FFFF00', '#8B00FF', '#FF007F', '#00FFFF',
];

interface Props {
  tray: TrayNodeData;
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

interface DragState {
  epId: string;
  x: number;
  y: number;
}

export default function TrayNode({ tray, nodes, edges, onCreateSplice }: Props) {
  const cables = nodes.filter(
    (n) => n.type === 'cableEnd' && (n as CableEndNodeData).parentId === tray.id,
  ) as CableEndNodeData[];

  const splices = (edges as SpliceEdgeData[]).filter(
    (e) => e.type === 'splice' && e.trayId === tray.id,
  );

  const [dragState, setDragState] = useState<DragState | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const groupRef = useRef<Konva.Group>(null);

  function handleFiberDragStart(epId: string, x: number, y: number) {
    setDragState({ epId, x, y });
  }

  function handleFiberDrop(epId: string, x: number, y: number) {
    if (dragState && dragState.epId !== epId) {
      // Validate both endpoints are in this tray
      const srcParts = parseEndpointId(dragState.epId);
      const tgtParts = parseEndpointId(epId);
      const srcCable = cables.find((c) => c.id === srcParts.cableNodeId);
      const tgtCable = cables.find((c) => c.id === tgtParts.cableNodeId);
      if (srcCable && tgtCable) {
        onCreateSplice(dragState.epId, epId, tray.id, dragState.x, dragState.y, x, y);
      }
    }
    setDragState(null);
  }

  return (
    <Group x={tray.x} y={tray.y} ref={groupRef}>
      {/* Clipping rect for tray content */}
      <Group
        clipX={0}
        clipY={0}
        clipWidth={tray.width}
        clipHeight={tray.height}
      >
        {/* Tray background */}
        <Rect
          width={tray.width}
          height={tray.height}
          fill="#455a64"
          stroke="#78909c"
          strokeWidth={1}
          cornerRadius={4}
        />
        {/* Tray label */}
        <Text
          text={tray.label ?? 'Tray'}
          x={4}
          y={4}
          fontSize={11}
          fill="#90a4ae"
        />
        {/* Splice lines */}
        {splices.map((splice) => {
          const pts = splice.vertices.flatMap((v) => [v.x, v.y]);
          return (
            <Line
              key={splice.id}
              points={pts}
              stroke="#ffd740"
              strokeWidth={2}
              lineCap="round"
            />
          );
        })}
        {/* Cable ends */}
        {cables.map((cable) => (
          <CableEndNode
            key={cable.id}
            cable={cable}
            onFiberDragStart={handleFiberDragStart}
            onFiberDrop={handleFiberDrop}
            tiaColors={TIA_COLORS}
          />
        ))}
        {/* Drag preview line */}
        {dragState && (
          <Line
            points={[dragState.x, dragState.y, mousePos.x, mousePos.y]}
            stroke="#ffd740"
            strokeWidth={1.5}
            dash={[4, 4]}
          />
        )}
      </Group>
      {/* Invisible rect to capture mouse move for drag preview */}
      {dragState && (
        <Rect
          width={tray.width}
          height={tray.height}
          fill="transparent"
          onMouseMove={(e) => {
            const stage = e.target.getStage();
            if (!stage) return;
            const pos = stage.getPointerPosition();
            if (!pos) return;
            // Convert stage coords to tray-local coords accounting for tray's absolute position
            const group = groupRef.current;
            if (group) {
              const abs = group.getAbsolutePosition();
              setMousePos({ x: pos.x - abs.x, y: pos.y - abs.y });
            } else {
              setMousePos({ x: pos.x, y: pos.y });
            }
          }}
          onMouseUp={() => setDragState(null)}
        />
      )}
    </Group>
  );
}
