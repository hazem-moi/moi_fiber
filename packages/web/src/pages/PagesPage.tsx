import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Page } from '@moi-fiber/shared';

export default function PagesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const nav = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    api.get<Page[]>(`/projects/${projectId}/pages`).then(setPages).catch(console.error);
  }, [projectId]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const p = await api.post<Page>(`/projects/${projectId}/pages`, { name });
    setPages((prev) => [...prev, p]);
    setName('');
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/projects" style={styles.back}>← Projects</Link>
        <h1>Pages</h1>
      </div>
      <form onSubmit={create} style={styles.createForm}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New page name"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>+ Create Page</button>
      </form>
      <ul style={styles.list}>
        {pages.map((p) => (
          <li
            key={p.id}
            style={styles.listItem}
            onClick={() => nav(`/projects/${projectId}/pages/${p.id}/edit`)}
          >
            <span style={styles.pageName}>{p.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 720, margin: '0 auto', padding: 32 },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 },
  back: { color: '#1a73e8', textDecoration: 'none', fontWeight: 500 },
  createForm: { display: 'flex', gap: 8, marginBottom: 24 },
  input: { flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 },
  button: { padding: '8px 16px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: 'white', borderRadius: 6, marginBottom: 8, boxShadow: '0 1px 4px rgba(0,0,0,.08)', cursor: 'pointer' },
  pageName: { fontWeight: 600 },
};
