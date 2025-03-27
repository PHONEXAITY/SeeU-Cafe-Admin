export const StatusBadge = ({ status }) => {
    const statusColors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-green-100 text-green-800',
      Delivered: 'bg-gray-100 text-gray-800'
    };
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
        {status}
      </span>
    );
  };