import { Stage, Layer } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import {
  NodeData,
  EdgeData,
  ClosureNodeData,
} from '@moi-fiber/shared';
import ClosureNode from './ClosureNode';

interface CanvasProps {
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

export default function Canvas({ nodes, edges, onCreateSplice }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const closures = nodes.filter((n) => n.type === 'closure') as ClosureNodeData[];

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#263238' }}>
      <Stage width={size.width} height={size.height}>
        <Layer>
          {closures.map((closure) => (
            <ClosureNode
              key={closure.id}
              closure={closure}
              nodes={nodes}
              edges={edges}
              onCreateSplice={onCreateSplice}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
