import React from 'react';
import { type DayNarrativeOut } from '../../types/trip';
import { Clock, BookOpen } from 'lucide-react';

interface PlanTimelineProps {
  days: DayNarrativeOut[];
  selectedPlaceName: string | null;
  activeDay: number;
  onDayChange: (dayIndex: number) => void;
  onSelectPlace: (placeName: string, coords: { lat: number; lng: number }) => void;
  routeStats?: { distance: string; duration: string }[];
  transportSlot?: string;
}

export const PlanTimeline: React.FC<PlanTimelineProps> = ({
  days,
  selectedPlaceName,
  activeDay,
  onDayChange,
  onSelectPlace,
  routeStats = [],
  transportSlot = '',
}) => {
  const activeDayData = days.find((d) => d.day_index === activeDay);
  
  const isDriving = transportSlot.includes('렌트카') || transportSlot.includes('차') || transportSlot.includes('택시');
  const TransportIcon = isDriving ? '🚗' : '🚶';

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm text-left">
      {/* Day tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/60 p-2 overflow-x-auto gap-2">
        {days.map((day) => (
          <button
            key={day.day_index}
            onClick={() => onDayChange(day.day_index)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeDay === day.day_index
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-900 hover:border-slate-400'
            }`}
          >
            Day {day.day_index + 1}
          </button>
        ))}
      </div>

      {/* Day narrative */}
      {activeDayData && (
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {/* Narrative summary */}
          <div className="flex items-start space-x-2.5 p-4 border-b border-slate-100 bg-slate-50/40">
            <BookOpen className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">{activeDayData.narrative}</p>
          </div>

          {/* Items */}
          <div className="p-4 relative">
            {/* The vertical timeline line */}
            <div className="absolute top-8 bottom-8 left-[4.5rem] w-0.5 bg-slate-200 rounded-full" />

            <div className="space-y-6">
              {activeDayData.items.map((item, idx) => {
                const coords = { lat: item.lat, lng: item.lng };
                const isSelected = selectedPlaceName === item.place_name;
                const hasNext = idx < activeDayData.items.length - 1;

                return (
                  <div key={item.place_id} className="relative flex items-stretch space-x-4">
                    {/* Left: Time Anchor */}
                    <div className="w-12 flex-shrink-0 pt-3 text-right">
                      <span className="text-[10px] font-black text-slate-500 whitespace-nowrap">
                        {item.arrival_time_label}
                      </span>
                    </div>

                    {/* Timeline Node + Segment Indicator */}
                    <div className="relative flex-shrink-0 w-6 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 z-10 ${
                          isSelected
                            ? 'bg-slate-950 text-white border-slate-950'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      
                      {/* Segment Indicator (if there's a next item and we have stats) */}
                      {hasNext && routeStats[idx] && (
                        <div className="absolute top-12 -left-10 w-24 flex justify-center z-10 pointer-events-none">
                          <div className="bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-sm text-[9px] font-bold text-slate-500 whitespace-nowrap">
                            {TransportIcon} {routeStats[idx].distance} · {routeStats[idx].duration}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Place Card */}
                    <button
                      onClick={() => onSelectPlace(item.place_name, coords)}
                      className={`flex-1 min-w-0 flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-200 group box-border ${
                        isSelected
                          ? 'bg-slate-950 border-slate-950 text-white shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-400 disabled:opacity-60'
                      }`}
                    >
                      <div className="w-full flex items-center justify-between gap-2 min-w-0">
                        <span className={`text-sm font-black truncate min-w-0 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {item.place_name}
                        </span>
                        {item.reservation_badge && (
                          <span className={`flex-shrink-0 text-[9px] font-bold border rounded-full px-2 py-0.5 ${
                            isSelected ? 'border-white/40 text-white/80' : 'border-amber-300 text-amber-600 bg-amber-50'
                          }`}>
                            {item.reservation_badge}
                          </span>
                        )}
                      </div>

                      <div className={`flex items-center space-x-2 mt-1.5 text-[10px] font-semibold ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                        <Clock className="h-3 w-3" />
                        <span className="capitalize">{item.time_period}</span>
                      </div>

                      {item.selection_reason && (
                        <p className={`text-[11px] mt-2 leading-relaxed line-clamp-2 ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                          {item.selection_reason}
                        </p>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTimeline;
