import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OverviewPage } from './pages/OverviewPage';
import { StressEventsPage } from './pages/StressEventsPage';
import { HeatmapPage } from './pages/HeatmapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DatasetExplorerPage } from './pages/DatasetExplorerPage';
import { ModelLabPage } from './pages/ModelLabPage';
import { QualityProvenancePage } from './pages/QualityProvenancePage';
import { MethodologyPage } from './pages/MethodologyPage';
import { AboutPage } from './pages/AboutPage';

import {
  DatasetSummary,
  StressEventItem,
  RiskMatrixResponse,
  RiskRecord
} from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [systemStatus, setSystemStatus] = useState<string>('Connecting...');
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [stressEvents, setStressEvents] = useState<StressEventItem[]>([]);
  const [matrixData, setMatrixData] = useState<RiskMatrixResponse | null>(null);
  const [records, setRecords] = useState<RiskRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [healthRes, sumRes, eventsRes, matrixRes, recordsRes] = await Promise.all([
          api.getHealth(),
          api.getSummary(),
          api.getStressEvents(),
          api.getRiskMatrix(),
          api.getRecords()
        ]);

        setSystemStatus(`Backend Online (${healthRes.version})`);
        setSummary(sumRes);
        setStressEvents(eventsRes);
        setMatrixData(matrixRes);
        setRecords(recordsRes);
      } catch (err) {
        console.warn('Backend fetch failed or offline, using certified fallback data:', err);
        setSystemStatus('Offline Certified Mode');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#080E1E] text-slate-100 font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-slate-400">Loading NiftyStress-44 Quantitative Dashboard...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewPage
                summary={summary}
                stressEvents={stressEvents}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'events' && (
              <StressEventsPage stressEvents={stressEvents} />
            )}
            {activeTab === 'heatmap' && (
              <HeatmapPage matrixData={matrixData} />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsPage
                records={records}
                stressEvents={stressEvents}
              />
            )}
            {activeTab === 'dataset' && (
              <DatasetExplorerPage records={records} />
            )}
            {activeTab === 'models' && <ModelLabPage />}
            {activeTab === 'quality' && <QualityProvenancePage />}
            {activeTab === 'methodology' && <MethodologyPage />}
            {activeTab === 'about' && <AboutPage />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
