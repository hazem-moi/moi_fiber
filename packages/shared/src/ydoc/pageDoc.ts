/**
 * Yjs document schema for a page.
 *
 * The top-level Y.Doc contains:
 *   nodes: Y.Map<NodeData>    keyed by node id
 *   edges: Y.Map<EdgeData>    keyed by edge id
 */

export type NodeType = 'closure' | 'tray' | 'cableEnd';
export type EdgeType = 'splice';

export interface BaseNodeData {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface ClosureNodeData extends BaseNodeData {
  type: 'closure';
}

export interface TrayNodeData extends BaseNodeData {
  type: 'tray';
  parentId: string; // closure id
}

export interface CableEndNodeData extends BaseNodeData {
  type: 'cableEnd';
  parentId: string; // tray id
  fiberCount: number;
  colorSchemeId: string;
  label: string;
}

export type NodeData = ClosureNodeData | TrayNodeData | CableEndNodeData;

export interface SpliceEdgeData {
  id: string;
  type: 'splice';
  sourceEndpoint: string; // ep:{cableNodeId}:fiber:{index}
  targetEndpoint: string;
  trayId: string;
  vertices: Array<{ x: number; y: number }>; // tray-local coords
}

export type EdgeData = SpliceEdgeData;

export const NODES_MAP = 'nodes';
export const EDGES_MAP = 'edges';
