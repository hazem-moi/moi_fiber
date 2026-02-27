import { Line } from 'react-konva';

interface Props {
  vertices: Array<{ x: number; y: number }>;
  color?: string;
}

export default function SpliceEdge({ vertices, color = '#ffd740' }: Props) {
  const points = vertices.flatMap((v) => [v.x, v.y]);
  return <Line points={points} stroke={color} strokeWidth={2} lineCap="round" />;
}
