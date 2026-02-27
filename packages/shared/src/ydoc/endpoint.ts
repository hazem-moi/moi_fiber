/**
 * Endpoint id helpers.
 * Format: ep:{cableNodeId}:fiber:{fiberIndex}
 */

export interface EndpointParts {
  cableNodeId: string;
  fiberIndex: number;
}

export function makeEndpointId(cableNodeId: string, fiberIndex: number): string {
  return `ep:${cableNodeId}:fiber:${fiberIndex}`;
}

export function parseEndpointId(epId: string): EndpointParts {
  const parts = epId.split(':');
  if (parts.length !== 4 || parts[0] !== 'ep' || parts[2] !== 'fiber') {
    throw new Error(`Invalid endpoint id: ${epId}`);
  }
  return {
    cableNodeId: parts[1],
    fiberIndex: parseInt(parts[3], 10),
  };
}
