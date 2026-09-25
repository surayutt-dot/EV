import React, { useState } from 'react';
import {
  Search,
  Fuel,
  Home,
  Trash2,
  Edit2,
  Calendar,
  Gauge,
  Zap,
  MapPin,
  FileText,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import { formatThaiDate } from '../utils/calculations';
import type { CalculatedSession } from '../utils/calculations';
import { getProviderById } from '../utils/providers';

interface HistoryListProps {
  sessions: CalculatedSession[];
  onEdit: (session: CalculatedSession) => void;
  onDelete: (id: string) => void;
  onOpenQuickLog: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  sessions,
  onEdit,
  onDelete,
  onOpenQuickLog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'home'>('all');

  const filteredSessions = sessions.filter((s) => {
    // Filter by type
    if (filterType === 'public' && s.locationType !== 'public') return false;
    if (filterType === 'home' && s.locationType !== 'home') return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const pName = s.providerName.toLowerCase();
      const station = (s.stationName || '').toLowerCase();
      const notes = (s.notes || '').toLowerCase();
      return pName.includes(q) || station.includes(q) || notes.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="ค้นหาชื่อค่าย, สถานีชาร์จ, หรือโน้ต..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ทั้งหมด ({sessions.length})
          </button>
          <button
            onClick={() => setFilterType('public')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
              filterType === 'public'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fuel className="w-3 h-3" />
            <span>นอกบ้าน</span>
          </button>
          <button
            onClick={() => setFilterType('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
              filterType === 'home'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-3 h-3" />
            <span>ชาร์จบ้าน</span>
          </button>
        </div>
      </div>

      {/* Session Cards List */}
      {filteredSessions.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-slate-400">ไม่พบรายการบันทึกที่ตรงกับเงื่อนไข</p>
          <button
            onClick={onOpenQuickLog}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            + บันทึกรายการใหม่
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const provider = getProviderById(session.providerId);
            const isHome = session.locationType === 'home';

            return (
              <div
                key={session.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all shadow-sm group"
              >
                {/* Header row: Brand badge, Date, and Cost */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: provider.brandColor }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{session.providerName}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isHome
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          }`}
                        >
                          {isHome ? 'ชาร์จบ้าน' : 'นอกบ้าน'}
                        </span>
                      </div>
                      <div className="flex items-center text-[11px] text-slate-400 mt-0.5 space-x-1.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{formatThaiDate(session.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-white">
                      ฿{session.cost.toLocaleString()}
                    </div>
                    {session.kwh && session.kwh > 0 && (
                      <div className="text-[11px] text-slate-400">
                        {session.kwh} kWh ({session.pricePerKwh ? `${session.pricePerKwh.toFixed(2)} ฿/u` : ''})
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics Bar: Odometer, Distance, Cost/km */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs mb-2.5">
                  <div>
                    <span className="text-[10px] text-slate-500 block">เลขไมล์</span>
                    <span className="font-bold text-slate-200 flex items-center">
                      <Gauge className="w-3 h-3 mr-1 text-slate-400" />
                      {session.odometer.toLocaleString()} กม.
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">ระยะทริปนี้</span>
                    <span className="font-bold text-slate-200">
                      {session.tripDistance !== undefined ? (
                        `+ ${session.tripDistance.toLocaleString()} กม.`
                      ) : (
                        <span className="text-slate-500 font-normal">จุดเริ่มต้น</span>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">ต้นทุนทริปนี้</span>
                    <span className="font-bold text-cyan-400 flex items-center">
                      {session.costPerKm !== undefined ? (
                        <>
                          <TrendingDown className="w-3 h-3 mr-0.5 text-cyan-400" />
                          {session.costPerKm.toFixed(2)} บ./กม.
                        </>
                      ) : (
                        <span className="text-slate-500 font-normal">-</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Optional SoC % or Station or Notes */}
                {(session.startSoc !== undefined || session.stationName || session.notes) && (
                  <div className="space-y-1.5 pt-1 text-xs text-slate-400 border-t border-slate-800/50">
                    {session.startSoc !== undefined && session.endSoc !== undefined && (
                      <div className="flex items-center space-x-2 text-[11px] text-slate-300">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>
                          แบตเตอรี่: <strong>{session.startSoc}%</strong>
                        </span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                        <span>
                          <strong>{session.endSoc}%</strong> (+{session.endSoc - session.startSoc}%)
                        </span>
                      </div>
                    )}

                    {session.stationName && (
                      <div className="flex items-center space-x-1.5 text-slate-300 text-xs">
                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{session.stationName}</span>
                      </div>
                    )}

                    {session.notes && (
                      <div className="flex items-start space-x-1.5 text-slate-400 text-xs italic bg-slate-950/40 p-2 rounded-lg">
                        <FileText className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                        <span>"{session.notes}"</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Actions: Edit & Delete */}
                <div className="flex items-center justify-end space-x-2 pt-2.5 mt-2 border-t border-slate-800/50">
                  <button
                    onClick={() => onEdit(session)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>แก้ไข</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`ต้องการลบรายการชาร์จ ${session.providerName} (${session.cost} บาท) ใช่หรือไม่?`)) {
                        onDelete(session.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ลบ</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
