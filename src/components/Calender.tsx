// components/Calendar.tsx
import { useState } from "react";

import {
  format,
  startOfWeek,
  addDays,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  parseISO,
} from "date-fns";

interface CalendarProps {
  selectedDate?: Date;
  onDateClick?: (day: Date) => void;
  holidays: string[]; // Array of holiday dates in 'yyyy-MM-dd' format
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateClick,
  holidays,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between mb-4 items-center">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Previous
        </button>
        <h2 className="text-xl font-semibold max-sm:text-lg">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EE";
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-gray-500 font-medium mb-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;

        // Check if the day is a holiday
        const isHoliday = holidays.some((holiday) =>
          isSameDay(parseISO(holiday), day)
        );

        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            className={`py-4 rounded-xl  text-center cursor-pointer `}
            key={day.toString()}
            onClick={() => onDateClick?.(cloneDay)}
          >
            <span
              title={format(day, "dd-MM-yyyy")}
              className={`size-6  p-3 rounded-full ${
                !isSameMonth(day, monthStart)
                  ? "text-gray-300"
                  : isToday && isHoliday
                  ? "bg-gradient-to-r from-red-500 to-blue-500 text-white"
                  : isHoliday
                  ? "bg-red-500 text-white" // Holiday date styling
                  : isSameDay(day, selectedDate ? selectedDate : "")
                  ? "bg-blue-500 text-white"
                  : isToday
                  ? "bg-blue-500 text-white "
                  : "hover:bg-blue-100"
              }`}
            >
              {formattedDate.length < 2 ? "0" + formattedDate : formattedDate}
            </span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 " key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="w-full  mx-auto p-4 border rounded-lg shadow-lg bg-white">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
