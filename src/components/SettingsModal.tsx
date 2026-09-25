import React, { useState } from 'react';
import {
  X,
  Car,
  Home,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';
import type { AppSettings } from '../types/ev';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onLoadSampleData: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onLoadSampleData,
  onResetData,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedAlert, setSavedAlert] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 800);
  };

  const handleExport = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `s5-ev-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJSON(content);
      if (success) {
        setImportStatus('นำเข้าข้อมูลสำเร็จ! กรุณารีเฟรชหรือโหลดหน้าใหม่');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setImportStatus('ไฟล์ไม่ถูกต้อง กรุณาตรวจสอบไฟล์สำรอง');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white m-0">ตั้งค่า & จัดการข้อมูล</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            {/* Section 1: Vehicle Profile */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center">
                <Car className="w-4 h-4 mr-1.5" />
                ข้อมูลรถยนต์ (Vehicle Profile)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">ยี่ห้อ</label>
                  <input
                    type="text"
                    value={formData.vehicle.brand}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle: { ...formData.vehicle, brand: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">รุ่น</label>
                  <input
                    type="text"
                    value={formData.vehicle.model}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle: { ...formData.vehicle, model: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">ความจุแบตเตอรี่ (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.vehicle.batteryCapacityKwh}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle: { ...formData.vehicle, batteryCapacityKwh: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">ระบบขับเคลื่อน</label>
                  <select
                    value={formData.vehicle.driveType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicle: { ...formData.vehicle, driveType: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="RWD">RWD (ขับเคลื่อนล้อหลัง)</option>
                    <option value="FWD">FWD (ขับเคลื่อนล้อหน้า)</option>
                    <option value="AWD">AWD (ขับเคลื่อน 4 ล้อ)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Home Charging Rates */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center">
                <Home className="w-4 h-4 mr-1.5" />
                อัตราค่าไฟบ้าน (TOU Electricity Rates)
              </h3>
              <p className="text-[11px] text-slate-400">
                ใช้คำนวณอัตโนมัติเมื่อกดเลือกชาร์จบ้าน
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Off-Peak (บ./u)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.homeTouOffPeakRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homeTouOffPeakRate: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">On-Peak (บ./u)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.homeTouOnPeakRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homeTouOnPeakRate: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">อัตราปกติ (บ./u)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.homeElectricityRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homeElectricityRate: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md transition-colors cursor-pointer"
            >
              {savedAlert ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedAlert ? 'บันทึกการตั้งค่าแล้ว!' : 'บันทึกการตั้งค่า'}</span>
            </button>
          </form>

          {/* Section 3: Backup & Restore */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              สำรองและกู้คืนข้อมูล (Backup & Restore)
            </h3>
            <p className="text-[11px] text-slate-400">
              ข้อมูลทั้งหมดเก็บไว้ในเครื่องของคุณ สามารถกดดาวน์โหลดไฟล์สำรองเพื่อย้ายเครื่องหรือแชร์ให้เพื่อนได้
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>ดาวน์โหลดสำรอง (Export)</span>
              </button>

              <label className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>นำเข้าข้อมูล (Import)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <p className="text-xs text-center font-medium text-cyan-400 bg-slate-950 p-2 rounded-lg">
                {importStatus}
              </p>
            )}
          </div>

          {/* Section 4: Sample Data & Reset */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              ตัวช่วยและรีเซ็ตข้อมูล
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('ต้องการโหลดข้อมูลตัวอย่างสำหรับ MG S5 หรือไม่? ข้อมูลเดิมจะถูกแทนที่')) {
                    onLoadSampleData();
                    onClose();
                  }
                }}
                className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center space-x-1 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>โหลดข้อมูลตัวอย่าง</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/30 text-xs font-medium flex items-center justify-center space-x-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ล้างข้อมูลทั้งหมด</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
