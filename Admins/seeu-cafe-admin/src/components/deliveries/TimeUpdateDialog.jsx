"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TimeUpdateDialog = ({ deliveryId, onUpdateTime, open, setOpen }) => {
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [notification, setNotification] = useState("");
  
  const handleTimeUpdate = async () => {
    if (!newTime) return;
    
    const timeData = {
      timeType: "estimated_delivery_time",
      newTime: new Date(newTime),
      reason,
      notifyCustomer,
      notificationMessage: notification || `Your delivery time has been updated to ${newTime}`,
      employeeId: 1, // This should be the current employee's ID
    };
    
    await onUpdateTime(timeData);
    setOpen(false);
    setNewTime("");
    setReason("");
    setNotification("");
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-medium">
          <Clock className="mr-2 h-4 w-4" /> Update Time
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Delivery Time</DialogTitle>
          <DialogDescription>
            Change the estimated delivery time for this order
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="time">New Estimated Delivery Time</Label>
            <Input
              id="time"
              type="datetime-local"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for Change</Label>
            <Textarea
              id="reason"
              placeholder="Why is the delivery time changing?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="notify" 
              checked={notifyCustomer}
              onCheckedChange={setNotifyCustomer}
            />
            <Label htmlFor="notify" className="cursor-pointer">Notify customer about this change</Label>
          </div>
          {notifyCustomer && (
            <div className="grid gap-2">
              <Label htmlFor="notification">Notification Message (optional)</Label>
              <Textarea
                id="notification"
                placeholder="Custom message to send to customer"
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleTimeUpdate}>Update Time</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeUpdateDialog;