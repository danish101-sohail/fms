// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';

// const Layout = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col" >
//       <Navbar />

//       <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
//         <Outlet />
//       </main>

//       <footer className="bg-gray-200 text-center py-4">
//         <p>&copy; 2024 Delhi Technlogical University. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Layout;

import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <div
      className={`min-h-screen bg-gray-100 flex flex-col ${isLoginPage ? 'bg-login' : ''}`}
    >
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-gray-200 text-center py-4">
        <p>&copy; 2024 Delhi Technological University. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;