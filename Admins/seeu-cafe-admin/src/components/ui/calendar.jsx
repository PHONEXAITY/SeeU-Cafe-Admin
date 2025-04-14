"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  // For month/year dropdown functionality
  const currentYear = new Date().getFullYear();
  const fromYear = 1950;
  const toYear = currentYear;
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => toYear - i
  );

  const months = [
    "ມັງກອນ",
    "ກຸມພາ",
    "ມີນາ",
    "ເມສາ",
    "ພຶດສະພາ",
    "ມິຖຸນາ",
    "ກໍລະກົດ",
    "ສິງຫາ",
    "ກັນຍາ",
    "ຕຸລາ",
    "ພະຈິກ",
    "ທັນວາ",
  ];

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 font-['Phetsarath_OT']", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-2",
        caption_label: "hidden", // Hide default label since we're using dropdowns
        caption_dropdowns: "flex justify-center items-center gap-2",
        nav: "flex items-center gap-2 absolute",
        nav_button: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-8 w-8 p-1 rounded-full bg-transparent hover:bg-primary/10 text-muted-foreground hover:text-primary"
        ),
        nav_button_previous: "left-0",
        nav_button_next: "right-0",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-10 font-normal text-xs",
        row: "flex w-full mt-1",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal rounded-full aria-selected:opacity-100 hover:bg-primary/10 hover:text-primary"
        ),
        day_today:
          "border border-primary/50 bg-primary/5 text-primary font-medium",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Dropdown: ({ value, onChange, children, ...props }) => {
          const options = React.Children.toArray(children);
          const isMonth = options.length <= 12;
          const displayLabel = isMonth ? months[value] : value;

          return (
            <Select
              value={value.toString()}
              onValueChange={(newValue) =>
                onChange({ target: { value: parseInt(newValue, 10) } })
              }
            >
              <SelectTrigger
                className={cn(
                  "px-2 py-1 rounded-md border border-input bg-background hover:bg-accent/50 focus:ring-0 focus:ring-offset-0",
                  "h-8 w-auto min-w-[4.5rem] flex justify-between items-center text-xs font-medium"
                )}
              >
                <SelectValue>{displayLabel}</SelectValue>
                <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                className="max-h-60 overflow-y-auto"
              >
                {options.map((option, i) => {
                  const optionValue = isMonth ? i : option.props.value;
                  const label = isMonth ? months[i] : option.props.value;
                  return (
                    <SelectItem
                      key={optionValue}
                      value={optionValue.toString()}
                      className="text-xs cursor-pointer"
                    >
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          );
        },
      }}
      captionLayout="dropdown-buttons"
      fromYear={fromYear}
      toYear={toYear}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
