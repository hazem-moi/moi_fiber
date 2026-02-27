import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { NodeData, EdgeData, NODES_MAP, EDGES_MAP } from '@moi-fiber/shared';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:1234';

export interface YDocStore {
  doc: Y.Doc;
  provider: WebsocketProvider;
  nodes: Y.Map<NodeData>;
  edges: Y.Map<EdgeData>;
  destroy: () => void;
}

export function createYDocStore(projectId: string, pageId: string): YDocStore {
  const roomName = `project:${projectId}:page:${pageId}`;
  const token = localStorage.getItem('token') ?? '';

  const doc = new Y.Doc();
  const provider = new WebsocketProvider(WS_URL, roomName, doc, {
    params: { token },
  });

  const nodes = doc.getMap<NodeData>(NODES_MAP);
  const edges = doc.getMap<EdgeData>(EDGES_MAP);

  return {
    doc,
    provider,
    nodes,
    edges,
    destroy: () => {
      provider.destroy();
      doc.destroy();
    },
  };
}
