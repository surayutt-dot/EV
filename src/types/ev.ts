export type ChargingLocationType = 'public' | 'home';

export interface ChargeSession {
  id: string;
  date: string; // ISO string or YYYY-MM-DDTHH:mm
  locationType: ChargingLocationType;
  providerId: string; // 'home', 'pea', 'rever', 'elex', 'ea', 'evme', 'shell', 'caltex', 'altervim', 'tesla', 'other'
  providerName: string;
  cost: number; // Baht
  odometer: number; // km at time of charge
  kwh?: number; // Optional kWh loaded
  startSoc?: number; // Optional starting %
  endSoc?: number; // Optional ending %
  stationName?: string; // Optional location / branch
  notes?: string; // Optional review or notes
  isFullCharge?: boolean; // did it charge to full / target?
  createdAt: number; // timestamp
}

export interface MaintenanceItem {
  id: string;
  title: string;
  category: 'tire' | 'insurance' | 'tax' | 'filter' | 'brake' | 'battery12v' | 'other';
  intervalKm?: number; // e.g. 10000 for tire rotation
  intervalMonths?: number; // e.g. 12 for insurance/tax
  lastPerformedKm?: number;
  lastPerformedDate?: string;
  dueDate?: string;
  dueKm?: number;
  notes?: string;
  isCompleted?: boolean;
}

export interface VehicleProfile {
  brand: string; // e.g. 'MG'
  model: string; // e.g. 'S5 EV รุ่น D+'
  licensePlate?: string;
  batteryCapacityKwh: number; // e.g. 49.1 or 62.2 kWh
  driveType: 'RWD' | 'FWD' | 'AWD'; // MG S5 is RWD
  initialOdometer: number; // starting km
}

export interface AppSettings {
  vehicle: VehicleProfile;
  homeElectricityRate: number; // Baht per kWh (e.g. 2.80 for TOU off-peak or 4.20 flat)
  homeTouOffPeakRate: number; // Baht per kWh
  homeTouOnPeakRate: number; // Baht per kWh
  currency: string;
  distanceUnit: string;
}
