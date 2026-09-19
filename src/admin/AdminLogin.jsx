import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginAdmin } from '../firebase/auth';

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);

      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
        <h1>Admin Login</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="admin-email">Email</label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password">Password</label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;