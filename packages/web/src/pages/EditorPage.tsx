import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createYDocStore, YDocStore } from '../store/ydoc';
import {
  NodeData,
  ClosureNodeData,
  TrayNodeData,
  CableEndNodeData,
  SpliceEdgeData,
  EdgeData,
} from '@moi-fiber/shared';
import Canvas from '../components/Canvas';

export default function EditorPage() {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();
  const storeRef = useRef<YDocStore | null>(null);
  const [, forceUpdate] = useState(0);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    if (!projectId || !pageId) return;
    const store = createYDocStore(projectId, pageId);
    storeRef.current = store;

    store.provider.on('status', ({ status }: { status: string }) => {
      setStatus(status as any);
    });

    const update = () => forceUpdate((n) => n + 1);
    store.nodes.observe(update);
    store.edges.observe(update);

    return () => {
      store.nodes.unobserve(update);
      store.edges.unobserve(update);
      store.destroy();
    };
  }, [projectId, pageId]);

  function getStore() {
    return storeRef.current!;
  }

  function addClosure() {
    const store = getStore();
    if (!store) return;
    const id = crypto.randomUUID();
    const closure: ClosureNodeData = {
      id,
      type: 'closure',
      x: 80 + Math.random() * 200,
      y: 80 + Math.random() * 100,
      width: 400,
      height: 300,
      label: 'Closure',
    };
    store.doc.transact(() => store.nodes.set(id, closure));
  }

  function addTray(closureId: string) {
    const store = getStore();
    if (!store) return;
    const id = crypto.randomUUID();
    // Find existing trays in this closure to position them
    const existingTrays = Array.from(store.nodes.values()).filter(
      (n) => n.type === 'tray' && (n as TrayNodeData).parentId === closureId,
    );
    const tray: TrayNodeData = {
      id,
      type: 'tray',
      parentId: closureId,
      x: 20,
      y: 40 + existingTrays.length * 120,
      width: 360,
      height: 100,
      label: `Tray ${existingTrays.length + 1}`,
    };
    store.doc.transact(() => store.nodes.set(id, tray));
  }

  function addCableEnd(trayId: string) {
    const store = getStore();
    if (!store) return;
    const id = crypto.randomUUID();
    // Count existing cable ends in this tray
    const existing = Array.from(store.nodes.values()).filter(
      (n) => n.type === 'cableEnd' && (n as CableEndNodeData).parentId === trayId,
    );
    const cable: CableEndNodeData = {
      id,
      type: 'cableEnd',
      parentId: trayId,
      x: 20 + existing.length * 160,
      y: 10,
      width: 140,
      height: 80,
      fiberCount: 12,
      colorSchemeId: 'tia-598-c',
      label: `Cable ${existing.length + 1}`,
    };
    store.doc.transact(() => store.nodes.set(id, cable));
  }

  function createSplice(
    sourceEp: string,
    targetEp: string,
    trayId: string,
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
  ) {
    const store = getStore();
    if (!store) return;

    // Check if either endpoint already has a splice
    const existingSplices = Array.from(store.edges.values()) as SpliceEdgeData[];
    const srcUsed = existingSplices.some(
      (e) => e.sourceEndpoint === sourceEp || e.targetEndpoint === sourceEp,
    );
    const tgtUsed = existingSplices.some(
      (e) => e.sourceEndpoint === targetEp || e.targetEndpoint === targetEp,
    );
    if (srcUsed || tgtUsed) {
      alert('One of these fiber endpoints is already spliced.');
      return;
    }

    const id = crypto.randomUUID();
    const splice: SpliceEdgeData = {
      id,
      type: 'splice',
      sourceEndpoint: sourceEp,
      targetEndpoint: targetEp,
      trayId,
      vertices: [
        { x: sourceX, y: sourceY },
        { x: targetX, y: targetY },
      ],
    };
    store.doc.transact(() => store.edges.set(id, splice));
  }

  const store = storeRef.current;
  const nodes = store ? Array.from(store.nodes.values()) : [];
  const edges = store ? Array.from(store.edges.values()) : [];
  const closures = nodes.filter((n) => n.type === 'closure') as ClosureNodeData[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <Link to={`/projects/${projectId}/pages`} style={styles.back}>
          ← Pages
        </Link>
        <span style={styles.status(status)}>
          {status === 'connected' ? '● Connected' : status === 'connecting' ? '○ Connecting…' : '✕ Disconnected'}
        </span>
        <div style={{ flex: 1 }} />
        <button onClick={addClosure} style={styles.toolBtn}>
          + Closure
        </button>
        {closures.map((c) => (
          <button key={c.id} onClick={() => addTray(c.id)} style={styles.toolBtn}>
            + Tray in {c.label}
          </button>
        ))}
        {nodes
          .filter((n) => n.type === 'tray')
          .map((t) => (
            <button key={t.id} onClick={() => addCableEnd(t.id)} style={styles.toolBtn}>
              + Cable in {(t as TrayNodeData).label}
            </button>
          ))}
      </div>
      {/* Canvas */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Canvas nodes={nodes} edges={edges as EdgeData[]} onCreateSplice={createSplice} />
      </div>
    </div>
  );
}

const styles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    background: '#1e2530',
    color: 'white',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  back: { color: '#90caf9', textDecoration: 'none', marginRight: 8 } as React.CSSProperties,
  status: (s: string): React.CSSProperties => ({
    fontSize: 12,
    color: s === 'connected' ? '#69f0ae' : s === 'connecting' ? '#ffd740' : '#ff5252',
  }),
  toolBtn: {
    padding: '6px 12px',
    background: '#37474f',
    color: 'white',
    border: '1px solid #546e7a',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
  } as React.CSSProperties,
};
