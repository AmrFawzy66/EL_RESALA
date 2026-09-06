import React, { useEffect, useState } from 'react';
import { Clock3, CalendarDays } from 'lucide-react';

/**
 * LiveClock — ticking wall clock + today's date, shown in the top status
 * bar so a cashier always has a time reference on-screen (useful for
 * shift timestamps, receipt double-checks, and closing time).
 */
export default function LiveClock({ compact = false }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: compact ? undefined : '2-digit' });
  const date = now.toLocaleDateString('ar-EG', { weekday: compact ? undefined : 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex items-center gap-3 text-sm text-gray-600 select-none">
      <span className="flex items-center gap-1.5 font-mono font-semibold tabular-nums text-resala-800">
        <Clock3 size={16} className="text-resala-500" />
        {time}
      </span>
      {!compact && (
        <span className="flex items-center gap-1.5 text-gray-500">
          <CalendarDays size={15} className="text-resala-400" />
          {date}
        </span>
      )}
    </div>
  );
}
