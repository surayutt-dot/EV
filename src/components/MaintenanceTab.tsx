import React, { useState } from 'react';
import {
  Wrench,
  RotateCw,
  Shield,
  FileCheck,
  Wind,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
} from 'lucide-react';
import type { MaintenanceItem } from '../types/ev';
import { calculateMaintenanceProgress } from '../utils/calculations';


interface MaintenanceTabProps {
  maintenanceItems: MaintenanceItem[];
  currentOdometer: number;
  onUpdateItem: (item: MaintenanceItem) => void;
  onAddItem: (item: MaintenanceItem) => void;
  onDeleteItem: (id: string) => void;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  maintenanceItems,
  currentOdometer,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MaintenanceItem['category']>('other');
  const [newIntervalKm, setNewIntervalKm] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const getCategoryIcon = (category: MaintenanceItem['category']) => {
    switch (category) {
      case 'tire':
        return <RotateCw className="w-5 h-5 text-amber-400" />;
      case 'insurance':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'tax':
        return <FileCheck className="w-5 h-5 text-purple-400" />;
      case 'filter':
        return <Wind className="w-5 h-5 text-teal-400" />;
      default:
        return <Wrench className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleMarkCompleted = (item: MaintenanceItem) => {
    if (item.intervalKm) {
      const updated: MaintenanceItem = {
        ...item,
        lastPerformedKm: currentOdometer,
        lastPerformedDate: new Date().toISOString(),
      };
      onUpdateItem(updated);
    } else if (item.intervalMonths && item.dueDate) {
      const curDue = new Date(item.dueDate);
      curDue.setMonth(curDue.getMonth() + item.intervalMonths);
      const updated: MaintenanceItem = {
        ...item,
        dueDate: curDue.toISOString().split('T')[0],
        lastPerformedDate: new Date().toISOString(),
      };
      onUpdateItem(updated);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: MaintenanceItem = {
      id: `m-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      intervalKm: newIntervalKm ? Number(newIntervalKm) : undefined,
      dueDate: newDueDate || undefined,
      lastPerformedKm: newIntervalKm ? currentOdometer : undefined,
      notes: newNotes.trim() || undefined,
      isCompleted: false,
    };

    onAddItem(newItem);
    setNewTitle('');
    setNewIntervalKm('');
    setNewDueDate('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Banner: RWD Special Alert for MG S5 */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0 mt-0.5">
            <RotateCw className="w-5 h-5 animate-spin-slow" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>ทำไม MG S5 (ขับหลัง RWD) ต้องใส่ใจเรื่องสลับยาง?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              รถยนต์ไฟฟ้าขับเคลื่อนล้อหลัง (RWD) มอเตอร์จะส่งแรงบิดสูงสู่ล้อหลังทันทีตั้งแต่เริ่มออกตัว
              บวกกับน้ำหนักแบตเตอรี่ ทำให้ <strong>ยางล้อหลังจะสึกหรอเร็วกว่าล้อหน้าอย่างเห็นได้ชัด</strong>
              การสลับยางหน้า-หลังทุก 10,000 กม. จะช่วยยืดอายุการใช้งานยางชุดใหม่ได้เป็นหมื่นกิโลเมตร
            </p>
          </div>
        </div>
      </div>

      {/* Header and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white m-0">รายการตรวจเช็คและบำรุงรักษา</h2>
          <p className="text-xs text-slate-400">
            คำนวณตามเลขไมล์ปัจจุบัน ({currentOdometer.toLocaleString()} กม.)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>เพิ่มรายการ</span>
        </button>
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {maintenanceItems.map((item) => {
          const { progressPercent, isOverdue, statusText } =
            calculateMaintenanceProgress(item, currentOdometer);

          return (
            <div
              key={item.id}
              className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all shadow-md flex flex-col justify-between ${
                isOverdue
                  ? 'border-red-500/50 bg-red-950/10'
                  : progressPercent >= 80
                  ? 'border-amber-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Title and Icon */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        {item.intervalKm
                          ? `ทุกๆ ${item.intervalKm.toLocaleString()} กม.`
                          : item.dueDate
                          ? `ครบกำหนด ${item.dueDate}`
                          : 'ตามระยะ'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    title="ลบรายการ"
                    className="text-slate-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span
                      className={`flex items-center ${
                        isOverdue
                          ? 'text-red-400 font-bold'
                          : progressPercent >= 80
                          ? 'text-amber-400 font-semibold'
                          : 'text-slate-300'
                      }`}
                    >
                      {isOverdue && <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-400" />}
                      {statusText}
                    </span>
                    <span className="text-slate-400 text-[11px]">{progressPercent}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className={`h-full transition-all duration-500 ${
                        isOverdue
                          ? 'bg-red-500'
                          : progressPercent >= 80
                          ? 'bg-amber-400'
                          : 'bg-cyan-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Details info */}
                {item.intervalKm && (
                  <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3">
                    <span>ทำล่าสุดที่: {(item.lastPerformedKm || 0).toLocaleString()} กม.</span>
                    <span>
                      รอบถัดไป: {((item.lastPerformedKm || 0) + item.intervalKm).toLocaleString()} กม.
                    </span>
                  </div>
                )}

                {item.notes && (
                  <p className="text-xs text-slate-400 bg-slate-950/60 p-2 rounded-xl mb-3 border border-slate-800/60">
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Complete button */}
              <button
                onClick={() => handleMarkCompleted(item)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-slate-700/60 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {item.intervalKm
                    ? `บันทึกว่าทำแล้ว (รีเซ็ตที่ไมล์ ${currentOdometer.toLocaleString()})`
                    : 'ต่ออายุเรียบร้อยแล้ว'}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">เพิ่มรายการตรวจเช็ค</h3>

            <form onSubmit={handleCreateNew} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชื่อรายการ <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น ตรวจเช็คน้ำมันเบรก, เช็คแบต 12V"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">หมวดหมู่</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="tire">ยางรถยนต์ (Tire)</option>
                  <option value="insurance">ประกันภัย (Insurance)</option>
                  <option value="tax">ภาษี / พ.ร.บ. (Tax)</option>
                  <option value="filter">กรองอากาศ (Filter)</option>
                  <option value="brake">ระบบเบรก (Brakes)</option>
                  <option value="battery12v">แบตเตอรี่ 12V</option>
                  <option value="other">อื่นๆ (General)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    เตือนทุกกี่ กม. (ถ้ามี)
                  </label>
                  <input
                    type="number"
                    placeholder="เช่น 10000"
                    value={newIntervalKm}
                    onChange={(e) => setNewIntervalKm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    วันครบกำหนด (ถ้ามี)
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">โน้ตช่วยจำ</label>
                <input
                  type="text"
                  placeholder="รายละเอียดเพิ่มเติม"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  เพิ่มรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
