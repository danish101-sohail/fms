// import LoginForm from '@/components/Auth/LoginForm';

// const LoginPage = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>
//         <LoginForm />
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import LoginForm from '@/components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-170px)] glass">
      <div className="max-w-md w-full mx-auto px-6">
        {/* <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Sign In
        </h2> */}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;