import React from 'react';
import { Plus, Settings, Zap, Gauge, Wrench, BarChart3, History } from 'lucide-react';
import type { VehicleProfile } from '../types/ev';

interface NavbarProps {
  vehicle: VehicleProfile;
  latestOdometer: number;
  activeTab: 'dashboard' | 'history' | 'maintenance';
  setActiveTab: (tab: 'dashboard' | 'history' | 'maintenance') => void;
  onOpenQuickLog: () => void;
  onOpenSettings: () => void;
  totalSessions: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  vehicle,
  latestOdometer,
  activeTab,
  setActiveTab,
  onOpenQuickLog,
  onOpenSettings,
  totalSessions,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Brand Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-tight text-white m-0">
                {vehicle.brand} {vehicle.model}
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {vehicle.driveType}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="flex items-center">
                <Gauge className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {latestOdometer > 0 ? `${latestOdometer.toLocaleString()} กม.` : 'ยังไม่มีเลขไมล์'}
              </span>
              <span>•</span>
              <span>{vehicle.batteryCapacityKwh} kWh</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenQuickLog}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>จดบันทึก</span>
          </button>

          <button
            onClick={onOpenSettings}
            title="ตั้งค่า & จัดการข้อมูล"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Segmented Control) */}
      <div className="max-w-4xl mx-auto px-4 pb-2">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center justify-center space-x-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>สรุปผล</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center space-x-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>ประวัติชาร์จ</span>
            {totalSessions > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300">
                {totalSessions}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center justify-center space-x-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'maintenance'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>สลับยาง & ดูแล</span>
          </button>
        </div>
      </div>
    </header>
  );
};
