// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logoutUser } from '@/store/slices/authSlice';
// import { fetchPendingApprovals } from '@/store/slices/bookingSlice';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { user } = useSelector((state) => state.auth);
//   const { pendingApprovals } = useSelector((state) => state.booking);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user && ['HOD', 'Registrar', 'CPO'].includes(user.role)) {
//       dispatch(fetchPendingApprovals());
//     }
//   }, [dispatch, user]);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate('/login');
//   };

//   const pendingCount = pendingApprovals ? pendingApprovals.length : 0;

//   return (
//     <nav className="bg-primary text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <Link to={user?.isAdmin ? "/admin" : "/dashboard"} className="font-bold text-xl">
//             <img src="./logo.jpeg" alt="logo" className='h-16' /></Link>
//           </div>
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-4">
//               {user && (
//                 <>
//                   <Link to="/dashboard" className="hover:bg-primary-dark px-3 py-2 rounded-md">Dashboard</Link>
//                   <Link to="/my-bookings" className="hover:bg-primary-dark px-3 py-2 rounded-md">My Bookings</Link>
//                   {['HOD', 'Registrar', 'CPO'].includes(user.role) && (
//                     <Link 
//                       to="/approvals" 
//                       className={`hover:bg-primary-dark px-3 py-2 rounded-md ${pendingCount > 0 ? 'bg-red-500' : ''}`}
//                     >
//                       Approvals {pendingCount > 0 && `(${pendingCount})`}
//                     </Link>
//                   )}
//                   <button onClick={handleLogout} className="hover:bg-primary-dark px-3 py-2 rounded-md">Logout</button>
//                 </>
//               )}
//               {!user && (
//                 <Link to="/login" className="hover:bg-primary-dark px-3 py-2 rounded-md">Login</Link>
//               )}
//             </div>
//           </div>
//           <div className="md:hidden">
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
//               <span className="sr-only">Open main menu</span>
//               <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//       {isMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {user && (
//               <>
//                 <Link to="/dashboard" className="block hover:bg-primary-dark px-3 py-2 rounded-md">Dashboard</Link>
//                 <Link to="/my-bookings" className="block hover:bg-primary-dark px-3 py-2 rounded-md">My Bookings</Link>
//                 {['HOD', 'Registrar', 'CPO'].includes(user.role) && (
//                   <Link 
//                     to="/approvals" 
//                     className={`block hover:bg-primary-dark px-3 py-2 rounded-md ${pendingCount > 0 ? 'bg-red-500' : ''}`}
//                   >
//                     Approvals {pendingCount > 0 && `(${pendingCount})`}
//                   </Link>
//                 )}
//                 <button onClick={handleLogout} className="block w-full text-left hover:bg-primary-dark px-3 py-2 rounded-md">Logout</button>
//               </>
//             )}
//             {!user && (
//               <Link to="/login" className="block hover:bg-primary-dark px-3 py-2 rounded-md">Login</Link>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

// frontend/src/components/Layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { fetchPendingApprovals } from '@/store/slices/bookingSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { pendingApprovals } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && ['HOD', 'Registrar', 'CPO'].includes(user.role)) {
      dispatch(fetchPendingApprovals());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const pendingCount = pendingApprovals ? pendingApprovals.length : 0;

  const renderNavLinks = () => (
    <>
      {user && (
        <>
          {user.isAdmin ? (
            <>
              <Link to="/admin" className="hover:bg-primary-dark px-3 py-2 rounded-md">All Bookings</Link>
              <Link to="/admin/venues" className="hover:bg-primary-dark px-3 py-2 rounded-md">Venues and Analytics</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:bg-primary-dark px-3 py-2 rounded-md">Dashboard</Link>
              <Link to="/my-bookings" className="hover:bg-primary-dark px-3 py-2 rounded-md">My Bookings</Link>
              {['HOD', 'Registrar', 'CPO'].includes(user.role) && (
                <Link 
                  to="/approvals" 
                  className={`hover:bg-primary-dark px-3 py-2 rounded-md ${pendingCount > 0 ? 'bg-red-500' : ''}`}
                >
                  Approvals {pendingCount > 0 && `(${pendingCount})`}
                </Link>
              )}
            </>
          )}
          <button onClick={handleLogout} className="hover:bg-primary-dark px-3 py-2 rounded-md">Logout</button>
        </>
      )}
      {!user && (
        <Link to="/login" className="hover:bg-primary-dark px-3 py-2 rounded-md">Login</Link>
      )}
    </>
  );

  return (
    <nav className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={user?.isAdmin ? "/admin" : "/dashboard"} className="font-bold text-xl">
              <img src="../../logo.jpeg" alt="logo" className='h-16' />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {renderNavLinks()}
            </div>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks()}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;