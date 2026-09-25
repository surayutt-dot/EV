import React from 'react';
import {
  Coins,
  Gauge,
  Zap,
  TrendingUp,
  Fuel,
  Home,
  Plus,
  Compass,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { EVAnalytics } from '../utils/calculations';
import type { VehicleProfile } from '../types/ev';

interface DashboardProps {
  analytics: EVAnalytics;
  vehicle: VehicleProfile;
  onOpenQuickLog: () => void;
  onLoadSampleData: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  analytics,
  vehicle,
  onOpenQuickLog,
  onLoadSampleData,
}) => {
  const hasData = analytics.enrichedSessions.length > 0;

  if (!hasData) {
    return (
      <div className="py-12 px-4 text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Zap className="w-10 h-10 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">ยินดีต้อนรับสู่ {vehicle.brand} {vehicle.model}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            เริ่มต้นจดบันทึกค่าชาร์จไฟทั้งนอกบ้าน (PEA, Rever, EleX ฯลฯ) และในบ้าน เพื่อคำนวณต้นทุน บาท/กม. จริง
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={onOpenQuickLog}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>บันทึกการชาร์จครั้งแรก</span>
          </button>

          <button
            onClick={onLoadSampleData}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>ทดลองโหลดข้อมูลตัวอย่างของ MG S5</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Cost per km */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-cyan-500/30 p-4 rounded-2xl relative overflow-hidden shadow-lg shadow-cyan-950/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium">ต้นทุนเฉลี่ยจริง</span>
            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
              <Coins className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {analytics.overallCostPerKm > 0 ? analytics.overallCostPerKm.toFixed(2) : '-'}
            </span>
            <span className="text-xs font-semibold text-cyan-400">บาท/กม.</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {analytics.totalDistance > 0
              ? `คำนวณจากระยะทาง ${analytics.totalDistance.toLocaleString()} กม.`
              : 'ต้องบันทึกอย่างน้อย 2 ครั้ง'}
          </p>
        </div>

        {/* Metric 2: Current Month Cost */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium">ค่าชาร์จเดือนนี้</span>
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-400">
              <Calendar className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {analytics.currentMonthCost.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-blue-400">บาท</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {analytics.currentMonthCostPerKm > 0
              ? `เฉลี่ย ${analytics.currentMonthCostPerKm} บ./กม. (${analytics.currentMonthDistance.toLocaleString()} กม.)`
              : 'เดือนปัจจุบัน'}
          </p>
        </div>

        {/* Metric 3: Total Spent */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium">ยอดชาร์จสะสม</span>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {analytics.totalCost.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-400">บาท</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            บันทึกทั้งหมด {analytics.enrichedSessions.length} รายการ
          </p>
        </div>

        {/* Metric 4: Total Distance / Odometer */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 p-4 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium">ระยะทางรวม</span>
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400">
              <Gauge className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {analytics.totalDistance.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-purple-400">กม.</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {analytics.totalKwh > 0 ? `ไฟรวม ${analytics.totalKwh} kWh (${analytics.avgPricePerKwh} บ./kWh)` : 'สะสมจากรอบบันทึก'}
          </p>
        </div>
      </div>

      {/* Home vs Public Ratio Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-white">สัดส่วนการชาร์จ (บ้าน vs นอกบ้าน)</span>
          </div>
          <span className="text-xs text-slate-400">จากยอดเงินรวม {analytics.totalCost.toLocaleString()} บาท</span>
        </div>

        {/* Progress Bar Bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 mb-3">
          <div
            style={{ width: `${analytics.publicPercentage}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            title={`นอกบ้าน ${analytics.publicPercentage}%`}
          />
          <div
            style={{ width: `${analytics.homePercentage}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            title={`ชาร์จบ้าน ${analytics.homePercentage}%`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-200 flex items-center">
                <Fuel className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                นอกบ้าน (Public DC/AC): {analytics.publicPercentage}%
              </div>
              <div className="text-slate-400">{analytics.publicCost.toLocaleString()} บาท</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-200 flex items-center">
                <Home className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                ชาร์จบ้าน (Home): {analytics.homePercentage}%
              </div>
              <div className="text-slate-400">{analytics.homeCost.toLocaleString()} บาท</div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Breakdown Chart & List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie / Donut Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">สัดส่วนค่าใช้จ่ายแยกตามค่าย (Provider Breakdown)</h3>
            <p className="text-xs text-slate-400 mb-4">แสดงยอดเงินที่จ่ายให้แต่ละผู้ให้บริการ</p>
          </div>

          {analytics.providerBreakdown.length > 0 ? (
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.providerBreakdown}
                    dataKey="totalCost"
                    nameKey="shortName"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {analytics.providerBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${Number(value || 0).toLocaleString()} บาท`, 'ยอดเงิน']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-500">
              ไม่มีข้อมูลสำหรับแสดงผล
            </div>
          )}

          {/* Provider List Summary */}
          <div className="space-y-2 mt-2 pt-3 border-t border-slate-800/80">
            {analytics.providerBreakdown.slice(0, 4).map((p) => (
              <div key={p.providerId} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="font-medium text-slate-300">{p.shortName}</span>
                  <span className="text-slate-500 text-[11px]">({p.sessionsCount} ครั้ง)</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">{p.totalCost.toLocaleString()} บ.</span>
                  <span className="text-slate-400 ml-1.5 font-medium">({p.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Expense Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">แนวโน้มค่าชาร์จรายเดือน (Monthly Trends)</h3>
            <p className="text-xs text-slate-400 mb-4">ยอดเงินค่าชาร์จในแต่ละเดือน</p>
          </div>

          {analytics.monthlyTrends.length > 0 ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={false}
                    tickFormatter={(val) => `฿${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value || 0).toLocaleString()} บาท`, 'ยอดชาร์จ']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="totalCost" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-500">
              ไม่มีข้อมูลสำหรับแสดงผล
            </div>
          )}

          {/* Tip Banner */}
          <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start space-x-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-slate-400 leading-relaxed">
              สำหรับ <strong className="text-slate-200">MG S5 (ขับหลัง RWD)</strong> การชาร์จ DC Fast Charge บ่อยๆ ปลอดภัยด้วยแบตเตอรี่ LFP แต่ควรเผื่อเวลาช่วง 80-100% เพราะความเร็วจะลดลงเพื่อถนอมเซลล์แบต
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
