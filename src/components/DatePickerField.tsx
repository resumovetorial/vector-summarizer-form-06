
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import FormField from './FormField';

interface DatePickerFieldProps {
  id: string;
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  error?: string;
  required?: boolean;
  animationDelay?: number;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  id,
  label,
  date,
  onDateChange,
  error,
  required = false,
  animationDelay = 0
}) => {
  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      animationDelay={animationDelay}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PP") : <span>Selecionar data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </FormField>
  );
};

export default DatePickerField;
