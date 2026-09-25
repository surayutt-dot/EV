import type { AppSettings, ChargeSession, MaintenanceItem } from '../types/ev';

const STORAGE_KEYS = {
  SESSIONS: 's5_ev_sessions',
  MAINTENANCE: 's5_ev_maintenance',
  SETTINGS: 's5_ev_settings',
};

export const DEFAULT_SETTINGS: AppSettings = {
  vehicle: {
    brand: 'MG',
    model: 'S5 EV รุ่น D+',
    licensePlate: '',
    batteryCapacityKwh: 49.1,
    driveType: 'RWD',
    initialOdometer: 0,
  },
  homeElectricityRate: 2.80, // Baht per kWh (TOU Off-peak)
  homeTouOffPeakRate: 2.80,
  homeTouOnPeakRate: 5.80,
  currency: '฿',
  distanceUnit: 'กม.',
};

export const DEFAULT_MAINTENANCE: MaintenanceItem[] = [
  {
    id: 'm1',
    title: 'สลับยางและถ่วงล้อ (Tire Rotation)',
    category: 'tire',
    intervalKm: 10000,
    lastPerformedKm: 0,
    notes: 'MG S5 เป็นรถขับหลัง (RWD) และมีแรงบิดสูง ยางหลังจะสึกไวกว่า ควรสลับยางทุก 10,000 กม.',
    isCompleted: false,
  },
  {
    id: 'm2',
    title: 'ต่อประกันภัยชั้น 1',
    category: 'insurance',
    intervalMonths: 12,
    dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    notes: 'ตรวจสอบเงื่อนไขความคุ้มครองแบตเตอรี่และระบุผู้ขับขี่เพื่อรับส่วนลด',
    isCompleted: false,
  },
  {
    id: 'm3',
    title: 'ต่อภาษีประจำปี และ พ.ร.บ.',
    category: 'tax',
    intervalMonths: 12,
    dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    notes: 'ภาษีรถ EV คิดตามพิกัดน้ำหนักรถ',
    isCompleted: false,
  },
  {
    id: 'm4',
    title: 'เปลี่ยนไส้กรองแอร์ห้องโดยสาร (Cabin Filter)',
    category: 'filter',
    intervalKm: 20000,
    lastPerformedKm: 0,
    notes: 'เปลี่ยนกรอง PM 2.5 เพื่อสุขภาพอากาศในห้องโดยสาร',
    isCompleted: false,
  },
];

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadSessions(): ChargeSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load sessions:', e);
  }
  return [];
}

export function saveSessions(sessions: ChargeSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions:', e);
  }
}

export function loadMaintenance(): MaintenanceItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load maintenance:', e);
  }
  return DEFAULT_MAINTENANCE;
}

export function saveMaintenance(items: MaintenanceItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save maintenance:', e);
  }
}

export function exportBackupJSON(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    settings: loadSettings(),
    sessions: loadSessions(),
    maintenance: loadMaintenance(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.sessions && Array.isArray(data.sessions)) {
      saveSessions(data.sessions);
    }
    if (data.settings) {
      saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
    }
    if (data.maintenance && Array.isArray(data.maintenance)) {
      saveMaintenance(data.maintenance);
    }
    return true;
  } catch (e) {
    console.error('Failed to import backup:', e);
    return false;
  }
}

/**
 * Realistic sample data for MG S5 EV
 */
export function getSampleSessions(): ChargeSession[] {
  const now = new Date();
  const daysAgo = (days: number, hour = 14) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    d.setHours(hour, 30, 0, 0);
    return d.toISOString();
  };

  return [
    {
      id: 's-1',
      date: daysAgo(28, 11),
      locationType: 'public',
      providerId: 'pea',
      providerName: 'PEA Volta (กฟภ.)',
      cost: 480,
      odometer: 150,
      kwh: 58.5,
      startSoc: 15,
      endSoc: 95,
      stationName: 'PEA Volta จุดพักรถมอเตอร์เวย์',
      notes: 'ออกรถวันแรก ชาร์จเตรียมเดินทาง DC 120kW ไวมาก',
      createdAt: Date.now() - 28 * 86400000,
    },
    {
      id: 's-2',
      date: daysAgo(22, 18),
      locationType: 'public',
      providerId: 'rever',
      providerName: 'Rêver Sharger',
      cost: 320,
      odometer: 490,
      kwh: 38.0,
      startSoc: 22,
      endSoc: 80,
      stationName: 'Rêver Sharger ปั๊ม Susco พระราม 2',
      notes: 'แวะซื้อกาแฟ ชาร์จ 25 นาทีแบตขึ้นถึง 80%',
      createdAt: Date.now() - 22 * 86400000,
    },
    {
      id: 's-3',
      date: daysAgo(16, 15),
      locationType: 'public',
      providerId: 'elex',
      providerName: 'EleX by EGAT (กฟผ.)',
      cost: 390,
      odometer: 840,
      kwh: 45.8,
      startSoc: 18,
      endSoc: 85,
      stationName: 'EleX ปั๊ม PT บางปะอิน',
      notes: 'ขากลับจากอยุธยา หัวชาร์จว่างพอดี',
      createdAt: Date.now() - 16 * 86400000,
    },
    {
      id: 's-4',
      date: daysAgo(10, 22),
      locationType: 'home',
      providerId: 'home',
      providerName: 'ชาร์จบ้าน (Home Charger)',
      cost: 95,
      odometer: 1180,
      kwh: 34.0,
      startSoc: 30,
      endSoc: 90,
      stationName: 'บ้านเพื่อน (TOU Off-Peak)',
      notes: 'ไปนอนบ้านเพื่อน ชาร์จข้ามคืนหน่วยละ 2.80 บาท ถูกและสบายมาก',
      createdAt: Date.now() - 10 * 86400000,
    },
    {
      id: 's-5',
      date: daysAgo(5, 13),
      locationType: 'public',
      providerId: 'pea',
      providerName: 'PEA Volta (กฟภ.)',
      cost: 360,
      odometer: 1530,
      kwh: 44.0,
      startSoc: 20,
      endSoc: 88,
      stationName: 'PEA Volta ปั๊มบางจาก บางนา',
      notes: 'ชาร์จ DC เต็มกำลัง 90kW นิ่งๆ',
      createdAt: Date.now() - 5 * 86400000,
    },
    {
      id: 's-6',
      date: daysAgo(1, 19),
      locationType: 'public',
      providerId: 'evme',
      providerName: 'EVme / PTT EV Station Plz',
      cost: 385,
      odometer: 1890,
      kwh: 46.5,
      startSoc: 16,
      endSoc: 85,
      stationName: 'PTT Station กิ่งแก้ว',
      notes: 'จองผ่านแอพไว้ล่วงหน้า ไปถึงเสียบได้เลย',
      createdAt: Date.now() - 1 * 86400000,
    },
  ];
}
