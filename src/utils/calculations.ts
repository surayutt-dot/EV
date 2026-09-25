import type { ChargeSession, MaintenanceItem } from '../types/ev';
import { getProviderById } from './providers';

export interface CalculatedSession extends ChargeSession {
  tripDistance?: number; // km driven since previous charge
  costPerKm?: number; // THB / km for this leg
  pricePerKwh?: number; // THB / kWh
}

export interface EVAnalytics {
  totalCost: number; // Baht
  totalDistance: number; // km
  overallCostPerKm: number; // Baht / km
  totalKwh: number; // kWh
  avgPricePerKwh: number; // Baht / kWh
  currentMonthCost: number; // Baht
  currentMonthDistance: number; // km
  currentMonthCostPerKm: number; // Baht / km
  homeCost: number; // Baht
  publicCost: number; // Baht
  homePercentage: number; // %
  publicPercentage: number; // %
  providerBreakdown: {
    providerId: string;
    providerName: string;
    shortName: string;
    totalCost: number;
    percentage: number;
    color: string;
    kwh: number;
    sessionsCount: number;
  }[];
  monthlyTrends: {
    monthKey: string; // '2026-09'
    monthLabel: string; // 'ก.ย. 2026'
    totalCost: number;
    distance: number;
    costPerKm: number;
  }[];
  enrichedSessions: CalculatedSession[];
}

/**
 * Sorts sessions by date ascending, computes delta distances and cost/km
 */
export function enrichSessions(sessions: ChargeSession[]): CalculatedSession[] {
  if (!sessions || sessions.length === 0) return [];

  // Sort ascending by date & odometer for chronological computation
  const sorted = [...sessions].sort((a, b) => {
    const timeDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.odometer - b.odometer;
  });

  const enriched: CalculatedSession[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const prev = i > 0 ? sorted[i - 1] : null;

    let tripDistance: number | undefined = undefined;
    let costPerKm: number | undefined = undefined;

    if (prev && current.odometer > prev.odometer) {
      tripDistance = current.odometer - prev.odometer;
      if (tripDistance > 0 && current.cost > 0) {
        costPerKm = current.cost / tripDistance;
      }
    }

    const pricePerKwh = current.kwh && current.kwh > 0 ? current.cost / current.kwh : undefined;

    enriched.push({
      ...current,
      tripDistance,
      costPerKm,
      pricePerKwh,
    });
  }

  // Return descending (newest first) for UI presentation
  return enriched.reverse();
}

const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export function formatThaiDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    const year = date.getFullYear() + 543;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes} น.`;
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    return `${day} ${month}`;
  } catch {
    return dateStr;
  }
}

export function calculateAnalytics(sessions: ChargeSession[]): EVAnalytics {
  if (!sessions || sessions.length === 0) {
    return {
      totalCost: 0,
      totalDistance: 0,
      overallCostPerKm: 0,
      totalKwh: 0,
      avgPricePerKwh: 0,
      currentMonthCost: 0,
      currentMonthDistance: 0,
      currentMonthCostPerKm: 0,
      homeCost: 0,
      publicCost: 0,
      homePercentage: 0,
      publicPercentage: 0,
      providerBreakdown: [],
      monthlyTrends: [],
      enrichedSessions: [],
    };
  }

  const enriched = enrichSessions(sessions);
  
  // Calculate Totals
  const totalCost = sessions.reduce((sum, s) => sum + (s.cost || 0), 0);
  const totalKwh = sessions.reduce((sum, s) => sum + (s.kwh || 0), 0);
  const avgPricePerKwh = totalKwh > 0 ? totalCost / totalKwh : 0;

  // Total Distance calculated from min & max odometer
  const odometers = sessions.map((s) => s.odometer).filter((o) => typeof o === 'number' && !isNaN(o));
  const minOdo = odometers.length > 0 ? Math.min(...odometers) : 0;
  const maxOdo = odometers.length > 0 ? Math.max(...odometers) : 0;
  const totalDistance = Math.max(0, maxOdo - minOdo);
  const overallCostPerKm = totalDistance > 0 ? totalCost / totalDistance : 0;

  // Home vs Public
  const homeCost = sessions
    .filter((s) => s.locationType === 'home' || s.providerId === 'home')
    .reduce((sum, s) => sum + (s.cost || 0), 0);
  const publicCost = totalCost - homeCost;
  const homePercentage = totalCost > 0 ? Math.round((homeCost / totalCost) * 100) : 0;
  const publicPercentage = totalCost > 0 ? 100 - homePercentage : 0;

  // Current Month Stats
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const currentMonthCost = currentMonthSessions.reduce((sum, s) => sum + (s.cost || 0), 0);
  const curMonthOdos = currentMonthSessions.map((s) => s.odometer).filter((o) => typeof o === 'number' && !isNaN(o));
  const curMin = curMonthOdos.length > 0 ? Math.min(...curMonthOdos) : 0;
  const curMax = curMonthOdos.length > 0 ? Math.max(...curMonthOdos) : 0;
  const currentMonthDistance = Math.max(0, curMax - curMin);
  const currentMonthCostPerKm = currentMonthDistance > 0 ? currentMonthCost / currentMonthDistance : 0;

  // Provider Breakdown
  const providerMap = new Map<string, { totalCost: number; kwh: number; count: number }>();
  sessions.forEach((s) => {
    const pId = s.locationType === 'home' ? 'home' : s.providerId || 'other';
    const existing = providerMap.get(pId) || { totalCost: 0, kwh: 0, count: 0 };
    existing.totalCost += s.cost || 0;
    existing.kwh += s.kwh || 0;
    existing.count += 1;
    providerMap.set(pId, existing);
  });

  const providerBreakdown = Array.from(providerMap.entries())
    .map(([providerId, data]) => {
      const p = getProviderById(providerId);
      return {
        providerId,
        providerName: p.name,
        shortName: p.shortName,
        totalCost: data.totalCost,
        percentage: totalCost > 0 ? Number(((data.totalCost / totalCost) * 100).toFixed(1)) : 0,
        color: p.brandColor,
        kwh: data.kwh,
        sessionsCount: data.count,
      };
    })
    .sort((a, b) => b.totalCost - a.totalCost);

  // Monthly trends (group by YYYY-MM)
  const monthMap = new Map<string, { totalCost: number; odos: number[] }>();
  sessions.forEach((s) => {
    const d = new Date(s.date);
    const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    const entry = monthMap.get(key) || { totalCost: 0, odos: [] };
    entry.totalCost += s.cost || 0;
    if (typeof s.odometer === 'number' && !isNaN(s.odometer)) {
      entry.odos.push(s.odometer);
    }
    monthMap.set(key, entry);
  });

  const sortedMonthKeys = Array.from(monthMap.keys()).sort();
  const monthlyTrends = sortedMonthKeys.map((key) => {
    const entry = monthMap.get(key)!;
    const [yearStr, monthStr] = key.split('-');
    const mIdx = parseInt(monthStr, 10) - 1;
    const monthLabel = `${THAI_MONTHS[mIdx]} ${parseInt(yearStr, 10) + 543}`;
    const minO = entry.odos.length > 0 ? Math.min(...entry.odos) : 0;
    const maxO = entry.odos.length > 0 ? Math.max(...entry.odos) : 0;
    const distance = Math.max(0, maxO - minO);
    const costPerKm = distance > 0 ? Number((entry.totalCost / distance).toFixed(2)) : 0;

    return {
      monthKey: key,
      monthLabel,
      totalCost: Math.round(entry.totalCost),
      distance,
      costPerKm,
    };
  });

  return {
    totalCost,
    totalDistance,
    overallCostPerKm: Number(overallCostPerKm.toFixed(2)),
    totalKwh: Number(totalKwh.toFixed(1)),
    avgPricePerKwh: Number(avgPricePerKwh.toFixed(2)),
    currentMonthCost,
    currentMonthDistance,
    currentMonthCostPerKm: Number(currentMonthCostPerKm.toFixed(2)),
    homeCost,
    publicCost,
    homePercentage,
    publicPercentage,
    providerBreakdown,
    monthlyTrends,
    enrichedSessions: enriched,
  };
}

export function calculateMaintenanceProgress(
  item: MaintenanceItem,
  currentOdometer: number
): {
  progressPercent: number;
  remainingKm?: number;
  remainingDays?: number;
  isOverdue: boolean;
  statusText: string;
} {
  let isOverdue = false;
  let progressPercent = 0;
  let remainingKm: number | undefined = undefined;
  let remainingDays: number | undefined = undefined;
  let statusText = 'ปกติ';

  if (item.intervalKm && item.intervalKm > 0) {
    const lastKm = item.lastPerformedKm || 0;
    const targetKm = lastKm + item.intervalKm;
    const kmDrivenSinceLast = Math.max(0, currentOdometer - lastKm);
    remainingKm = targetKm - currentOdometer;

    progressPercent = Math.min(100, Math.max(0, Math.round((kmDrivenSinceLast / item.intervalKm) * 100)));

    if (remainingKm <= 0) {
      isOverdue = true;
      statusText = `เลยกำหนดแล้ว ${Math.abs(remainingKm).toLocaleString()} กม.!`;
    } else if (remainingKm <= 1000) {
      statusText = `ใกล้ถึงกำหนด (เหลือ ${remainingKm.toLocaleString()} กม.)`;
    } else {
      statusText = `เหลืออีก ${remainingKm.toLocaleString()} กม.`;
    }
  } else if (item.dueDate) {
    const targetDate = new Date(item.dueDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (remainingDays <= 0) {
      isOverdue = true;
      statusText = `หมดอายุแล้ว ${Math.abs(remainingDays)} วัน!`;
      progressPercent = 100;
    } else if (remainingDays <= 30) {
      statusText = `เหลืออีก ${remainingDays} วัน (ใกล้ครบกำหนด)`;
      progressPercent = Math.round(((365 - remainingDays) / 365) * 100);
    } else {
      statusText = `เหลืออีก ${remainingDays} วัน`;
      progressPercent = Math.max(10, Math.round(((365 - remainingDays) / 365) * 100));
    }
  }

  return {
    progressPercent,
    remainingKm,
    remainingDays,
    isOverdue,
    statusText,
  };
}
