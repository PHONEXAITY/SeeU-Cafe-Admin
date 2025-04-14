'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useEmployees from '@/hooks/useEmployees';
import { format } from 'date-fns';

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Icons
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  MapPin,
  CreditCard,
  UserCircle,
  Edit,
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Building,
  ClipboardList,
  Clock,
  CalendarDays,
  History,
} from 'lucide-react';

const EmployeeDetails = ({ employeeId }) => {
  const router = useRouter();
  const {
    selectedEmployee,
    loading,
    error,
    fetchEmployeeById,
  } = useEmployees();

  // Fetch employee data on component mount
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeById(parseInt(employeeId));
    }
  }, [employeeId, fetchEmployeeById]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get initials for avatar fallback
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Helper to get status badge
  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      leave: "bg-amber-100 text-amber-800",
      inactive: "bg-rose-100 text-rose-800"
    };
    
    const labels = {
      active: "ເຮັດວຽກຢູ່",
      leave: "ລາພັກ",
      inactive: "ພັກວຽກ"
    };

    return (
      <Badge className={styles[status] || "bg-gray-100 text-gray-800"}>
        {labels[status] || status}
      </Badge>
    );
  };

  // Helper to get gender icon
  const getGenderIcon = (gender) => {
    if (gender === 'male') {
      return <User className="h-4 w-4 text-blue-500" />; // Use User icon for male
    } else if (gender === 'female') {
      return <User className="h-4 w-4 text-pink-500" />; // Use User icon for female
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-5 w-28" />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ລາຍລະອຽດພະນັກງານ</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>ເກີດຂໍ້ຜິດພາດ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <Button 
            onClick={() => router.push('/employees')}
            className="mt-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            ກັບຄືນໄປຍັງລາຍການພະນັກງານ
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Return null if no employee is selected yet
  if (!selectedEmployee) {
    return null;
  }

  return (
    <Card className="shadow-sm font-['Phetsarath_OT']">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
            <div className="bg-amber-100 p-3 rounded-xl">
              <UserCircle className="h-5 w-5 text-amber-600" />
            </div>
              ລາຍລະອຽດພະນັກງານ
            </CardTitle>
            <CardDescription>
              ຂໍ້ມູນສ່ວນຕົວແລະລາຍລະອຽດຂອງພະນັກງານ
            </CardDescription>
          </div>
          
          <Button 
            onClick={() => router.push(`/employees/edit/${employeeId}`)}
            className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
          >
            <Edit className="h-4 w-4" />
            ແກ້ໄຂຂໍ້ມູນ
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile section */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-32 w-32 border-4 border-primary/10">
              <AvatarImage 
                src={selectedEmployee.profile_photo || ''} 
                alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`} 
              />
              <AvatarFallback className="text-2xl">
                {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h2 className="text-xl font-bold">
                {selectedEmployee.first_name} {selectedEmployee.last_name}
              </h2>
              
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge variant="outline" className="font-medium text-primary">
                  {selectedEmployee.position}
                </Badge>
                {getStatusBadge(selectedEmployee.status)}
              </div>
              
              {selectedEmployee.Employee_id && (
                <p className="text-sm text-muted-foreground mt-2">
                  ລະຫັດພະນັກງານ: {selectedEmployee.Employee_id}
                </p>
              )}
            </div>
          </div>
          
          {/* Details section */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              {/* Contact information */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    ຂໍ້ມູນຕິດຕໍ່
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEmployee.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEmployee.phone || '-'}</span>
                  </div>
                  
                  {selectedEmployee.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{selectedEmployee.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Personal information */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    ຂໍ້ມູນສ່ວນຕົວ
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {selectedEmployee.gender && (
                    <div className="flex items-center gap-3">
                      {getGenderIcon(selectedEmployee.gender)}
                      <span>
                        {selectedEmployee.gender === 'male' ? 'ຊາຍ' : 
                         selectedEmployee.gender === 'female' ? 'ຍິງ' : 
                         selectedEmployee.gender}
                      </span>
                    </div>
                  )}
                  
                  {selectedEmployee.date_of_birth && (
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>ວັນເດືອນປີເກີດ: {formatDate(selectedEmployee.date_of_birth)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Employment information */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    ຂໍ້ມູນການເຮັດວຽກ
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>ຕຳແໜ່ງ: {selectedEmployee.position}</span>
                  </div>
                  
                  {selectedEmployee.salary !== null && (
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>ເງິນເດືອນ: {selectedEmployee.salary.toLocaleString()} LAK</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                    <span>ສະຖານະ: {getStatusBadge(selectedEmployee.status)}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* System information */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    ຂໍ້ມູນລະບົບ
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>ວັນທີສ້າງ: {formatDate(selectedEmployee.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>ອັບເດດລ່າສຸດ: {formatDate(selectedEmployee.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Related data section */}
            {(selectedEmployee.orders?.length > 0 || selectedEmployee.delivery?.length > 0) && (
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">ຂໍ້ມູນທີ່ກ່ຽວຂ້ອງ</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Orders */}
                  {selectedEmployee.orders?.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-primary" />
                          ອໍເດີລ່າສຸດ
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-2">
                          {selectedEmployee.orders.slice(0, 5).map((order) => (
                            <div 
                              key={order.id} 
                              className="flex justify-between items-center p-2 border-b last:border-0"
                            >
                              <div className="text-sm">
                                <p className="font-medium">#{order.order_id}</p>
                                <p className="text-muted-foreground">
                                  {(order.total_price || 0).toLocaleString()} LAK
                                </p>
                              </div>
                              <Badge>{order.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Deliveries */}
                  {selectedEmployee.delivery?.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Truck className="h-4 w-4 text-primary" />
                          ການຈັດສົ່ງລ່າສຸດ
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-2">
                          {selectedEmployee.delivery.slice(0, 5).map((delivery) => (
                            <div 
                              key={delivery.id} 
                              className="flex justify-between items-center p-2 border-b last:border-0"
                            >
                              <div className="text-sm">
                                <p className="font-medium">#{delivery.delivery_id}</p>
                              </div>
                              <Badge>{delivery.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>ເລີ່ມວຽກ: {formatDate(selectedEmployee.created_at)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmployeeDetails;