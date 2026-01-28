import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ContestList } from './components/ContestList';
import { ProblemList } from './components/ProblemList';
import { StudyPlan } from './components/StudyPlan';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [handle, setHandle] = useState<string | null>(null);
  const [inputHandle, setInputHandle] = useState('');

  // "Remember me" - Check localStorage on mount
  useEffect(() => {
    const savedHandle = localStorage.getItem('cf_handle');
    if (savedHandle) {
      setHandle(savedHandle);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputHandle.trim()) {
      setHandle(inputHandle.trim());
      localStorage.setItem('cf_handle', inputHandle.trim());
      setActiveTab(Tab.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setHandle(null);
    setInputHandle('');
    localStorage.removeItem('cf_handle');
  };

  if (!handle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Codeforces<span className="text-blue-500">Lite</span></h1>
            <p className="text-gray-500">Enter your Codeforces handle to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">Handle</label>
              <input
                id="handle"
                type="text"
                required
                value={inputHandle}
                onChange={(e) => setInputHandle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. tourist"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-400">
            <p>Uses official Codeforces public API.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        handle={handle}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === Tab.DASHBOARD && <Dashboard handle={handle} />}
        {activeTab === Tab.CONTESTS && <ContestList />}
        {activeTab === Tab.PROBLEMS && <ProblemList />}
        {activeTab === Tab.STUDY_PLAN && <StudyPlan handle={handle} />}
      </main>
    </div>
  );
};

export default App;