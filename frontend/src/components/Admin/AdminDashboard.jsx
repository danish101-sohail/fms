// frontend/src/components/Admin/AdminDashboard.jsx
import {Outlet} from 'react-router-dom';

const AdminDashboard = () => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;