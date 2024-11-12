import { useSelector } from 'react-redux';
import ApprovalsList from '@/components/Approvals/ApprovalsList';

const ApprovalsPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Pending Approvals</h1>
      <p className="text-gray-600 mb-8">{`Here's an overview of bookings pending your approval, ${user.name}:`}</p>
      <ApprovalsList />
    </div>
  );
};

export default ApprovalsPage;