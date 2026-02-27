import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';

export default function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post<{ accessToken: string }>('/auth/register', { name, email, password });
      localStorage.setItem('token', res.accessToken);
      nav('/projects');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Moi Fiber</h1>
        <h2>Create Account</h2>
        <form onSubmit={submit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f4f8' },
  card: { background: 'white', padding: 32, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,.12)', minWidth: 320 },
  title: { color: '#1a73e8', marginBottom: 4 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 },
  button: { padding: '10px 0', background: '#1a73e8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 },
  error: { color: '#e53935', fontSize: 13 },
};
