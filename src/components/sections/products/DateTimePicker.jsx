import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";

export default function DateTimePicker({ label, value, onChange }) {
  const [startDate, setStartDate] = useState(value ? new Date(value) : null);

  const handleChange = (date) => {
    setStartDate(date);
    onChange(date);
  };

  return (
    <div className="flex flex-col gap-1 sm:gap-2 w-full text-xs sm:text-sm md:text-[13px] sm:w-61.25">
      <label className="text-xs sm:text-sm md:text-[13px] font-medium text-right py-2">
{label}</label>
      <div className="h-11 sm:h-13.75 px-3 sm:px-4 rounded-xl border border-[#0000004D] flex items-center justify-between text-xs sm:text-sm text-right w-full bg-[#ffffff]">
        <DatePicker
          selected={startDate}
          onChange={handleChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="ساعت"
          dateFormat="yyyy/MM/dd HH:mm"
          placeholderText="انتخاب تاریخ و ساعت"
          className="w-full h-full text-right text-xs sm:text-sm md:text-[13px] border-none focus:outline-none bg-transparent"
          calendarClassName="rounded-xl"
        />
        <Calendar size={16} />
      </div>
    </div>
  );
}
