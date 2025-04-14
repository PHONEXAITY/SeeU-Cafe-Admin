"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const CustomerInfo = ({ user }) => {
  const router = useRouter();
  
  if (!user) {
    return <p className="text-gray-500">Customer information not available</p>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-white">
            {user.first_name?.charAt(0)}
            {user.last_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-lg">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => router.push(`/customers/${user.id}`)}
      >
        View Customer Profile
      </Button>
    </div>
  );
};

export default CustomerInfo;