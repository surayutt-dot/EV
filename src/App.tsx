import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { HistoryList } from './components/HistoryList';
import { MaintenanceTab } from './components/MaintenanceTab';
import { QuickLogModal } from './components/QuickLogModal';
import { SettingsModal } from './components/SettingsModal';
import type { ChargeSession, MaintenanceItem, AppSettings } from './types/ev';
import {
  loadSettings,
  saveSettings,
  loadSessions,
  saveSessions,
  loadMaintenance,
  saveMaintenance,
  getSampleSessions,
  DEFAULT_SETTINGS,
  DEFAULT_MAINTENANCE,
} from './utils/storage';
import { calculateAnalytics } from './utils/calculations';
import type { CalculatedSession } from './utils/calculations';


export function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [sessions, setSessions] = useState<ChargeSession[]>(() => loadSessions());
  const [maintenance, setMaintenance] = useState<MaintenanceItem[]>(() => loadMaintenance());

  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'maintenance'>('dashboard');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CalculatedSession | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Compute analytics and enriched sessions
  const analytics = useMemo(() => {
    return calculateAnalytics(sessions);
  }, [sessions]);

  // Current latest odometer
  const latestOdometer = useMemo(() => {
    if (!sessions || sessions.length === 0) return settings.vehicle.initialOdometer || 0;
    const odos = sessions.map((s) => s.odometer).filter((o) => typeof o === 'number' && !isNaN(o));
    return odos.length > 0 ? Math.max(...odos) : settings.vehicle.initialOdometer || 0;
  }, [sessions, settings.vehicle.initialOdometer]);

  // Save / Update session
  const handleSaveSession = (
    data: Omit<ChargeSession, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    let updated: ChargeSession[];
    if (existingId) {
      updated = sessions.map((s) =>
        s.id === existingId ? { ...s, ...data } : s
      );
    } else {
      const newSession: ChargeSession = {
        ...data,
        id: `s-${Date.now()}`,
        createdAt: Date.now(),
      };
      updated = [...sessions, newSession];
    }
    setSessions(updated);
    saveSessions(updated);
    setEditingSession(null);
  };

  // Delete session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
  };

  // Maintenance handlers
  const handleUpdateMaintenanceItem = (item: MaintenanceItem) => {
    const updated = maintenance.map((m) => (m.id === item.id ? item : m));
    setMaintenance(updated);
    saveMaintenance(updated);
  };

  const handleAddMaintenanceItem = (item: MaintenanceItem) => {
    const updated = [...maintenance, item];
    setMaintenance(updated);
    saveMaintenance(updated);
  };

  const handleDeleteMaintenanceItem = (id: string) => {
    const updated = maintenance.filter((m) => m.id !== id);
    setMaintenance(updated);
    saveMaintenance(updated);
  };

  // Settings handlers
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleLoadSampleData = () => {
    const samples = getSampleSessions();
    setSessions(samples);
    saveSessions(samples);
    setMaintenance(DEFAULT_MAINTENANCE);
    saveMaintenance(DEFAULT_MAINTENANCE);
  };

  const handleResetData = () => {
    setSessions([]);
    saveSessions([]);
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    setMaintenance(DEFAULT_MAINTENANCE);
    saveMaintenance(DEFAULT_MAINTENANCE);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navbar */}
      <Navbar
        vehicle={settings.vehicle}
        latestOdometer={latestOdometer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickLog={() => {
          setEditingSession(null);
          setIsQuickLogOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalSessions={sessions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5">
        {activeTab === 'dashboard' && (
          <Dashboard
            analytics={analytics}
            vehicle={settings.vehicle}
            onOpenQuickLog={() => {
              setEditingSession(null);
              setIsQuickLogOpen(true);
            }}
            onLoadSampleData={handleLoadSampleData}
          />
        )}

        {activeTab === 'history' && (
          <HistoryList
            sessions={analytics.enrichedSessions}
            onEdit={(s) => {
              setEditingSession(s);
              setIsQuickLogOpen(true);
            }}
            onDelete={handleDeleteSession}
            onOpenQuickLog={() => {
              setEditingSession(null);
              setIsQuickLogOpen(true);
            }}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceTab
            maintenanceItems={maintenance}
            currentOdometer={latestOdometer}
            onUpdateItem={handleUpdateMaintenanceItem}
            onAddItem={handleAddMaintenanceItem}
            onDeleteItem={handleDeleteMaintenanceItem}
          />
        )}
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="fixed bottom-5 right-5 sm:hidden z-20">
        <button
          onClick={() => {
            setEditingSession(null);
            setIsQuickLogOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/50 flex items-center justify-center active:scale-90 transition-transform cursor-pointer border-2 border-slate-900"
          aria-label="บันทึกการชาร์จ"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => {
          setIsQuickLogOpen(false);
          setEditingSession(null);
        }}
        onSave={handleSaveSession}
        editingSession={editingSession}
        latestOdometer={latestOdometer}
        settings={settings}
      />

      {/* Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onLoadSampleData={handleLoadSampleData}
        onResetData={handleResetData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center space-x-1">
          <span>MG S5 EV Tracker</span>
          <span>•</span>
          <span>คำนวณต้นทุนชาร์จไฟจริง (Public DC & Home TOU)</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
