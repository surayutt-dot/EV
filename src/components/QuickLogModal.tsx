import React, { useState, useEffect } from 'react';
import { X, Zap, Home, Fuel, Calendar, MapPin, FileText, CheckCircle2, BatteryCharging, Sparkles } from 'lucide-react';
import type { ChargeSession, ChargingLocationType, AppSettings } from '../types/ev';
import { CHARGING_PROVIDERS, getProviderById } from '../utils/providers';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: Omit<ChargeSession, 'id' | 'createdAt'>, existingId?: string) => void;
  editingSession?: ChargeSession | null;
  latestOdometer: number;
  settings: AppSettings;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSession,
  latestOdometer,
  settings,
}) => {
  const [locationType, setLocationType] = useState<ChargingLocationType>('public');
  const [providerId, setProviderId] = useState<string>('pea');
  const [cost, setCost] = useState<string>('');
  const [odometer, setOdometer] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [kwh, setKwh] = useState<string>('');
  const [startSoc, setStartSoc] = useState<string>('');
  const [endSoc, setEndSoc] = useState<string>('');
  const [stationName, setStationName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [homeRateType, setHomeRateType] = useState<'offpeak' | 'onpeak' | 'custom'>('offpeak');

  // Format current date for datetime-local input
  const getNowForInput = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (editingSession) {
      setLocationType(editingSession.locationType);
      setProviderId(editingSession.providerId);
      setCost(editingSession.cost.toString());
      setOdometer(editingSession.odometer.toString());
      setDate(editingSession.date.slice(0, 16));
      setKwh(editingSession.kwh ? editingSession.kwh.toString() : '');
      setStartSoc(editingSession.startSoc !== undefined ? editingSession.startSoc.toString() : '');
      setEndSoc(editingSession.endSoc !== undefined ? editingSession.endSoc.toString() : '');
      setStationName(editingSession.stationName || '');
      setNotes(editingSession.notes || '');
      if (editingSession.kwh || editingSession.startSoc || editingSession.notes) {
        setShowAdvanced(true);
      }
    } else {
      // New session defaults
      setLocationType('public');
      setProviderId('pea');
      setCost('');
      setOdometer(latestOdometer > 0 ? (latestOdometer + 150).toString() : '');
      setDate(getNowForInput());
      setKwh('');
      setStartSoc('20');
      setEndSoc('80');
      setStationName('');
      setNotes('');
      setShowAdvanced(false);
    }
  }, [editingSession, isOpen, latestOdometer]);

  if (!isOpen) return null;

  // Auto calculate home cost when kWh is typed and location is home
  const handleKwhChange = (value: string) => {
    setKwh(value);
    if (locationType === 'home' && value && !isNaN(Number(value))) {
      const units = Number(value);
      const rate =
        homeRateType === 'offpeak'
          ? settings.homeTouOffPeakRate
          : homeRateType === 'onpeak'
          ? settings.homeTouOnPeakRate
          : settings.homeElectricityRate;
      const calculatedCost = Math.round(units * rate);
      setCost(calculatedCost.toString());
    }
  };

  // Instant Trip calculation preview
  const numCost = parseFloat(cost) || 0;
  const numOdometer = parseFloat(odometer) || 0;
  const prevOdo = editingSession ? 0 : latestOdometer;
  const deltaDistance = numOdometer > prevOdo && prevOdo > 0 ? numOdometer - prevOdo : 0;
  const instantCostPerKm = deltaDistance > 0 && numCost > 0 ? (numCost / deltaDistance).toFixed(2) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cost || isNaN(Number(cost)) || Number(cost) <= 0) {
      alert('กรุณากรอกยอดเงินที่จ่าย');
      return;
    }
    if (!odometer || isNaN(Number(odometer)) || Number(odometer) <= 0) {
      alert('กรุณากรอกเลขไมล์ปัจจุบันของรถ');
      return;
    }

    const effectiveProvider = locationType === 'home' ? 'home' : providerId;
    const providerMeta = getProviderById(effectiveProvider);

    onSave(
      {
        date: new Date(date).toISOString(),
        locationType,
        providerId: effectiveProvider,
        providerName: providerMeta.name,
        cost: Number(cost),
        odometer: Number(odometer),
        kwh: kwh && !isNaN(Number(kwh)) ? Number(kwh) : undefined,
        startSoc: startSoc !== '' && !isNaN(Number(startSoc)) ? Number(startSoc) : undefined,
        endSoc: endSoc !== '' && !isNaN(Number(endSoc)) ? Number(endSoc) : undefined,
        stationName: stationName.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      editingSession?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white m-0">
                {editingSession ? 'แก้ไขบันทึกการชาร์จ' : 'บันทึกการชาร์จไฟ'}
              </h2>
              <p className="text-xs text-slate-400">
                {editingSession ? 'อัปเดตข้อมูลรายการชาร์จ' : 'กรอกยอดเงินและเลขไมล์เพื่อคำนวณต้นทุน'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Location Type Switcher: Home vs Public */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">สถานที่ชาร์จ</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setLocationType('public');
                  if (providerId === 'home') setProviderId('pea');
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  locationType === 'public'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Fuel className="w-4 h-4" />
                <span>นอกบ้าน (Public DC/AC)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLocationType('home');
                  setProviderId('home');
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  locationType === 'home'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>ชาร์จบ้าน (Home)</span>
              </button>
            </div>
          </div>

          {/* Provider Selection */}
          {locationType === 'public' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                ผู้ให้บริการ (แตะเลือกค่ายชาร์จ)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CHARGING_PROVIDERS.filter((p) => p.type === 'public').map((p) => {
                  const isSelected = providerId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProviderId(p.id)}
                      className={`px-2.5 py-2 rounded-xl text-left border text-xs font-medium transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? `border-cyan-400 bg-cyan-950/40 text-white ring-1 ring-cyan-400 shadow-sm`
                          : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: p.brandColor }}
                        />
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <span className="font-semibold truncate w-full">{p.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 flex items-center">
                  <Home className="w-4 h-4 mr-1.5" />
                  อัตราค่าไฟบ้าน (TOU)
                </span>
                <span className="text-xs text-slate-400">
                  {homeRateType === 'offpeak'
                    ? `Off-Peak: ${settings.homeTouOffPeakRate} บ./หน่วย`
                    : homeRateType === 'onpeak'
                    ? `On-Peak: ${settings.homeTouOnPeakRate} บ./หน่วย`
                    : `${settings.homeElectricityRate} บ./หน่วย`}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setHomeRateType('offpeak');
                    if (kwh) handleKwhChange(kwh);
                  }}
                  className={`py-1 px-2 text-xs rounded-lg font-medium cursor-pointer ${
                    homeRateType === 'offpeak'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Off-Peak ({settings.homeTouOffPeakRate}฿)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHomeRateType('onpeak');
                    if (kwh) handleKwhChange(kwh);
                  }}
                  className={`py-1 px-2 text-xs rounded-lg font-medium cursor-pointer ${
                    homeRateType === 'onpeak'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  On-Peak ({settings.homeTouOnPeakRate}฿)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHomeRateType('custom');
                    if (kwh) handleKwhChange(kwh);
                  }}
                  className={`py-1 px-2 text-xs rounded-lg font-medium cursor-pointer ${
                    homeRateType === 'custom'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  อัตราปกติ ({settings.homeElectricityRate}฿)
                </button>
              </div>
            </div>
          )}

          {/* Primary Inputs: Cost & Odometer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ยอดเงินที่จ่าย (บาท) <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="เช่น 350"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
                  required
                />
                <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">บาท</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                เลขไมล์ปัจจุบัน (กม.) <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  inputMode="numeric"
                  placeholder={latestOdometer > 0 ? `ล่าสุด: ${latestOdometer}` : 'เช่น 1500'}
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
                  required
                />
                <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">กม.</span>
              </div>
            </div>
          </div>

          {/* Instant Calculation Preview Banner */}
          {instantCostPerKm && (
            <div className="p-3 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>
                  วิ่งมา <strong>{deltaDistance.toLocaleString()} กม.</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400">ต้นทุนทริปนี้: </span>
                <span className="text-sm font-bold text-cyan-300">{instantCostPerKm} บาท/กม.</span>
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              วันและเวลาชาร์จ
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Toggle Advanced Fields */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'ซ่อนข้อมูลเสริม' : '+ บันทึกข้อมูลเสริม (kWh, % แบตเตอรี่, สถานี, โน้ต)'}</span>
            </button>
          </div>

          {/* Advanced / Optional Fields */}
          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t border-slate-800/80 animate-in fade-in">
              {/* kWh Energy */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  พลังงานที่ได้ (kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    placeholder="เช่น 45.2"
                    value={kwh}
                    onChange={(e) => handleKwhChange(e.target.value)}
                    className="w-full pl-3.5 pr-12 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <span className="absolute right-3.5 top-3 text-xs text-slate-500">kWh</span>
                </div>
                {kwh && cost && Number(kwh) > 0 && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    เฉลี่ยประมาณ {(Number(cost) / Number(kwh)).toFixed(2)} บาท/kWh
                  </p>
                )}
              </div>

              {/* Start & End Battery % (SoC) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">% แบตก่อนชาร์จ</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="20%"
                    value={startSoc}
                    onChange={(e) => setStartSoc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">% แบตหลังชาร์จ</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="80%"
                    value={endSoc}
                    onChange={(e) => setEndSoc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Station Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  ชื่อสถานี / สาขา
                </label>
                <input
                  type="text"
                  placeholder="เช่น ปั๊มบางจาก บางนา กม. 12"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Review / Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  โน้ต / รีวิวตู้
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น ตู้ 120kW แรงดี หัวชาร์จไม่ตัด มีกาแฟและห้องน้ำสะอาด"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-3 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              {editingSession ? 'บันทึกการแก้ไข' : 'บันทึกรายการ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
