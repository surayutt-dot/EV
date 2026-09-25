export interface ChargingProvider {
  id: string;
  name: string;
  shortName: string;
  type: 'home' | 'public';
  brandColor: string; // Tailwind or Hex
  textColor: string;
  borderColor: string;
  bgLight: string;
  description: string;
}

export const CHARGING_PROVIDERS: ChargingProvider[] = [
  {
    id: 'home',
    name: 'ชาร์จบ้าน (Home Charger)',
    shortName: 'ชาร์จบ้าน',
    type: 'home',
    brandColor: '#10b981', // emerald-500
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgLight: 'bg-emerald-500/10',
    description: 'Wallbox ที่บ้าน / มิเตอร์ TOU'
  },
  {
    id: 'pea',
    name: 'PEA Volta (กฟภ.)',
    shortName: 'PEA Volta',
    type: 'public',
    brandColor: '#8b5cf6', // purple-500
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgLight: 'bg-purple-500/10',
    description: 'เครือข่าย กฟภ. ทั่วประเทศ'
  },
  {
    id: 'rever',
    name: 'Rêver Sharger',
    shortName: 'Rêver',
    type: 'public',
    brandColor: '#06b6d4', // cyan-500
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgLight: 'bg-cyan-500/10',
    description: 'เครือข่าย Rêver ทั่วไทย'
  },
  {
    id: 'elex',
    name: 'EleX by EGAT (กฟผ.)',
    shortName: 'EleX กฟผ.',
    type: 'public',
    brandColor: '#f59e0b', // amber-500
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgLight: 'bg-amber-500/10',
    description: 'ตู้ชาร์จ กฟผ. ตามปั๊ม PT & ทางหลวง'
  },
  {
    id: 'ea',
    name: 'EA Anywhere',
    shortName: 'EA Anywhere',
    type: 'public',
    brandColor: '#3b82f6', // blue-500
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgLight: 'bg-blue-500/10',
    description: 'ห้างสรรพสินค้า & อาคารสำนักงาน'
  },
  {
    id: 'evme',
    name: 'EVme / PTT EV Station Plz',
    shortName: 'EV Station Plz',
    type: 'public',
    brandColor: '#ef4444', // red-500
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgLight: 'bg-red-500/10',
    description: 'ปั๊ม PTT Station ทั่วประเทศ'
  },
  {
    id: 'shell',
    name: 'Shell Recharge',
    shortName: 'Shell Recharge',
    type: 'public',
    brandColor: '#eab308', // yellow-500
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    bgLight: 'bg-yellow-500/10',
    description: 'ปั๊ม Shell DC Fast Charge'
  },
  {
    id: 'caltex',
    name: 'Caltex / EVolt',
    shortName: 'EVolt',
    type: 'public',
    brandColor: '#14b8a6', // teal-500
    textColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    bgLight: 'bg-teal-500/10',
    description: 'Caltex & คอนโด/โรงแรม'
  },
  {
    id: 'altervim',
    name: 'Altervim Super Charge',
    shortName: 'Altervim',
    type: 'public',
    brandColor: '#84cc16', // lime-500
    textColor: 'text-lime-400',
    borderColor: 'border-lime-500/30',
    bgLight: 'bg-lime-500/10',
    description: 'Lotus’s & CP Group'
  },
  {
    id: 'tesla',
    name: 'Tesla Supercharger',
    shortName: 'Tesla',
    type: 'public',
    brandColor: '#f43f5e', // rose-500
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    bgLight: 'bg-rose-500/10',
    description: 'Tesla Supercharger สถานีเปิด'
  },
  {
    id: 'other',
    name: 'ค่ายอื่นๆ (Other Provider)',
    shortName: 'อื่นๆ',
    type: 'public',
    brandColor: '#64748b', // slate-500
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500/30',
    bgLight: 'bg-slate-500/10',
    description: 'ตู้ชาร์จเอกชนหรือค่ายอื่น'
  }
];

export function getProviderById(id: string): ChargingProvider {
  return (
    CHARGING_PROVIDERS.find((p) => p.id === id) || {
      id: 'other',
      name: 'ค่ายอื่นๆ',
      shortName: 'อื่นๆ',
      type: 'public',
      brandColor: '#64748b',
      textColor: 'text-slate-400',
      borderColor: 'border-slate-500/30',
      bgLight: 'bg-slate-500/10',
      description: 'ตู้ชาร์จอื่นๆ'
    }
  );
}
