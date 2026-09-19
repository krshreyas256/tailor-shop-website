import { useNavigate } from 'react-router-dom';

import { logoutAdmin } from '../firebase/auth';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <main>
      <section>
        <h1>Admin Dashboard</h1>

        <p>Welcome to the Prema Tailoring & Design admin panel.</p>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </section>
    </main>
  );
}

export default AdminDashboard;