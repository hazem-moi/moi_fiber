import { Group, Rect, Text } from 'react-konva';

interface Props {
  cable: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    fiberCount: number;
  };
  tiaColors: string[];
  onFiberDragStart: (epId: string, x: number, y: number) => void;
  onFiberDrop: (epId: string, x: number, y: number) => void;
}

const FIBER_SIZE = 10;
const FIBER_GAP = 2;
const FIBERS_PER_ROW = 6;

export default function CableEndNode({ cable, tiaColors, onFiberDragStart, onFiberDrop }: Props) {
  return (
    <Group x={cable.x} y={cable.y}>
      {/* Background */}
      <Rect
        width={cable.width}
        height={cable.height}
        fill="#37474f"
        stroke="#546e7a"
        strokeWidth={1}
        cornerRadius={3}
      />
      {/* Label */}
      <Text text={cable.label} x={4} y={4} fontSize={10} fill="#cfd8dc" />
      {/* Fiber grid */}
      {Array.from({ length: cable.fiberCount }).map((_, i) => {
        const col = i % FIBERS_PER_ROW;
        const row = Math.floor(i / FIBERS_PER_ROW);
        const fx = 4 + col * (FIBER_SIZE + FIBER_GAP);
        const fy = 16 + row * (FIBER_SIZE + FIBER_GAP);
        const epId = `ep:${cable.id}:fiber:${i}`;
        const color = tiaColors[i % tiaColors.length];

        return (
          <Rect
            key={i}
            x={fx}
            y={fy}
            width={FIBER_SIZE}
            height={FIBER_SIZE}
            fill={color}
            stroke="#000"
            strokeWidth={0.5}
            cornerRadius={2}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              const absPos = e.target.getAbsolutePosition();
              onFiberDragStart(epId, absPos.x + FIBER_SIZE / 2, absPos.y + FIBER_SIZE / 2);
            }}
            onMouseUp={(e) => {
              e.cancelBubble = true;
              const absPos = e.target.getAbsolutePosition();
              onFiberDrop(epId, absPos.x + FIBER_SIZE / 2, absPos.y + FIBER_SIZE / 2);
            }}
          />
        );
      })}
    </Group>
  );
}
