import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Project } from '@moi-fiber/shared';

export default function ProjectsPage() {
  const nav = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    api.get<Project[]>('/projects').then(setProjects).catch(console.error);
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const p = await api.post<Project>('/projects', { name });
    setProjects((prev) => [p, ...prev]);
    setName('');
  }

  function logout() {
    localStorage.removeItem('token');
    nav('/login');
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Projects</h1>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
      <form onSubmit={create} style={styles.createForm}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>+ Create Project</button>
      </form>
      <ul style={styles.list}>
        {projects.map((p) => (
          <li key={p.id} style={styles.listItem} onClick={() => nav(`/projects/${p.id}/pages`)}>
            <span style={styles.projectName}>{p.name}</span>
            <span style={styles.projectDate}>{new Date(p.createdAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 720, margin: '0 auto', padding: 32 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  logoutBtn: { padding: '6px 14px', background: '#e53935', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' },
  createForm: { display: 'flex', gap: 8, marginBottom: 24 },
  input: { flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 },
  button: { padding: '8px 16px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: 'white', borderRadius: 6, marginBottom: 8, boxShadow: '0 1px 4px rgba(0,0,0,.08)', cursor: 'pointer' },
  projectName: { fontWeight: 600 },
  projectDate: { color: '#777', fontSize: 13 },
};
