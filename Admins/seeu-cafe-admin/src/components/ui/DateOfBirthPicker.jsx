"use client";
import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  CakeIcon,
  UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const DateOfBirthPicker = ({
  date,
  onDateChange,
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = date ? new Date(date) : null;
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  
  // Get current year for range calculations
  const currentYear = new Date().getFullYear();
  
  // Years range (allow selection of birth year from 1940 to current year)
  const years = Array.from(
    { length: currentYear - 1940 + 1 },
    (_, i) => currentYear - i
  );
  
  const months = [
    "ມັງກອນ", "ກຸມພາ", "ມີນາ", "ເມສາ", 
    "ພຶດສະພາ", "ມິຖຸນາ", "ກໍລະກົດ", "ສິງຫາ", 
    "ກັນຍາ", "ຕຸລາ", "ພະຈິກ", "ທັນວາ"
  ];

  // Helper function to calculate age
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format the date for display in Lao format
  const formatDateDisplay = (date) => {
    if (!date) return "";
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  const age = calculateAge(date);

  // Function to handle month selection
  const handleMonthChange = (newMonth) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(parseInt(newMonth));
    setViewDate(newDate);
  };

  // Function to handle year selection
  const handleYearChange = (newYear) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(parseInt(newYear));
    setViewDate(newDate);
  };

  // Function to handle day selection
  const handleDaySelect = (day) => {
    if (day) {
      onDateChange(day.toISOString());
      setIsOpen(false);
    }
  };

  // Generate days for the current month/year view
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    // Get first day of month (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = date.getDay();
    
    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty spaces for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const daysOfWeek = ["ອາທິດ", "ຈັນ", "ອັງຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ"];
  const monthDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Function to determine if a date is today
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Function to determine if a date is selected
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Function to check if a date is disabled (future dates or dates before 1940)
  const isDisabled = (date) => {
    if (!date) return true;
    const minDate = new Date(1940, 0, 1);
    const today = new Date();
    return date > today || date < minDate;
  };

  // Previous and next month navigation
  const goToPreviousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  return (
    <div className={cn("space-y-1", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              "h-12 px-4 py-2 rounded-lg border border-input hover:border-primary focus:border-primary",
              "bg-background hover:bg-muted/10 transition-all duration-200",
              "font-['Phetsarath_OT'] group relative overflow-hidden",
              !selectedDate && "text-muted-foreground",
              "shadow-sm hover:shadow",
              "focus-visible:ring-2 focus-visible:ring-primary/20"
            )}
          >
            <div className="flex items-center gap-3 w-full relative z-10">
              <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                <CalendarIcon className="h-4 w-4 text-primary" />
              </div>
              {selectedDate ? (
                <div className="flex-1">
                  <span className="block text-xs text-muted-foreground">
                    ວັນເດືອນປີເກີດ
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium">
                      {formatDateDisplay(selectedDate)}
                    </span>
                    {age !== null && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 text-xs ml-2">
                        {age} ປີ
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span>ເລືອກວັນທີ...</span>
                </span>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 rounded-xl shadow-lg border border-border/80 bg-background overflow-hidden font-['Phetsarath_OT']"
          align="start"
          sideOffset={8}
        >
          <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <h3 className="font-medium text-center text-base text-foreground flex items-center justify-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>ເລືອກວັນເດືອນປີເກີດ</span>
            </h3>
            {selectedDate && (
              <div className="flex items-center justify-center mt-2 gap-2">
                <span className="text-sm text-muted-foreground">ອາຍຸ:</span>
                <Badge className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  {age} ປີ
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4">
            {/* Month/Year Selection */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousMonth}
                disabled={viewDate.getFullYear() === 1940 && viewDate.getMonth() === 0}
                className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                <Select
                  value={viewDate.getMonth().toString()}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger
                    className="h-8 min-w-[120px] text-sm bg-background border-input focus:ring-0"
                  >
                    <SelectValue placeholder="ເດືອນ" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-60">
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()} className="text-sm">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={viewDate.getFullYear().toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger
                    className="h-8 min-w-[90px] text-sm bg-background border-input focus:ring-0"
                  >
                    <SelectValue placeholder="ປີ" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-60 overflow-y-auto">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()} className="text-sm">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                disabled={viewDate > new Date()}
                className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className="text-center text-xs font-medium text-muted-foreground py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  disabled={!day || isDisabled(day)}
                  onClick={() => day && handleDaySelect(day)}
                  className={cn(
                    "h-9 w-9 p-0 rounded-full text-sm font-normal",
                    isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    isToday(day) && !isSelected(day) && "border border-primary/30 bg-primary/5 text-foreground",
                    !day && "invisible",
                    !isSelected(day) && !isToday(day) && "hover:bg-muted/20"
                  )}
                >
                  {day?.getDate()}
                </Button>
              ))}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="p-3 border-t bg-muted/10 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedDate ? (
                <div className="flex items-center gap-1">
                  <span>ເລືອກແລ້ວ:</span> 
                  <span className="font-medium text-foreground">{formatDateDisplay(selectedDate)}</span>
                </div>
              ) : (
                "ຍັງບໍ່ໄດ້ເລືອກວັນທີ"
              )}
            </div>
            <div className="flex gap-1">
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onDateChange(null);
                  }}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 text-xs h-8"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  ລຶບ
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-primary border-primary/30 hover:bg-primary/10 text-xs h-8"
              >
                ຕົກລົງ
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DateOfBirthPicker };