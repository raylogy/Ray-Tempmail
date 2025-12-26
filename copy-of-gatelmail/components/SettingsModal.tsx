import React, { useState } from 'react';
import { DataSource, UserSettings } from '../types';
import { Icons } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [newDomain, setNewDomain] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleAddDomain = () => {
    const domain = newDomain.trim().toLowerCase();
    if (domain && domain.includes('.') && !localSettings.customDomains.includes(domain)) {
        setLocalSettings(prev => ({
            ...prev,
            customDomains: [...prev.customDomains, domain],
            activeDomain: prev.activeDomain || domain // Set as active if none exists
        }));
        setNewDomain('');
    }
  };

  const handleRemoveDomain = (domainToRemove: string) => {
      const newDomains = localSettings.customDomains.filter(d => d !== domainToRemove);
      let newActive = localSettings.activeDomain;
      
      // If we removed the active one, switch to the first available or empty
      if (domainToRemove === newActive) {
          newActive = newDomains[0] || '';
      }

      setLocalSettings(prev => ({
          ...prev,
          customDomains: newDomains,
          activeDomain: newActive
      }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-[#0c0c0e] border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-[#121215] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Icons.Settings /> System Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-1">Configure data sources and identity.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Custom Domain Section - UPDATED for Multi-Domain */}
          <div>
             <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">
                1. Custom Domain Identity
             </label>
             <p className="text-[10px] text-slate-400 mb-3">
                Add domains you want to use. You can switch between these in the sidebar.
             </p>
             
             {/* Add New Domain */}
             <div className="flex gap-2 mb-4">
                 <div className="flex-1 flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 focus-within:border-indigo-500 transition-all">
                    <span className="text-slate-500 text-sm select-none">@</span>
                    <input
                        type="text"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
                        placeholder="new-domain.com"
                        className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder-slate-600 font-medium"
                    />
                 </div>
                 <button 
                    onClick={handleAddDomain}
                    disabled={!newDomain.includes('.')}
                    className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors"
                 >
                    Add
                 </button>
             </div>

             {/* Domain List */}
             <div className="flex flex-wrap gap-2">
                {localSettings.customDomains.map(domain => (
                    <div key={domain} className="group flex items-center gap-2 bg-slate-800/40 border border-slate-700 rounded-lg px-3 py-1.5 hover:border-slate-500 transition-all">
                        <span className={`text-xs ${domain === localSettings.activeDomain ? 'text-indigo-300 font-bold' : 'text-slate-300'}`}>
                            @{domain}
                        </span>
                        <button 
                            onClick={() => handleRemoveDomain(domain)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                ))}
                {localSettings.customDomains.length === 0 && (
                    <span className="text-xs text-slate-600 italic">No domains configured. Add one above.</span>
                )}
             </div>
          </div>

          <div className="border-t border-slate-800 my-4"></div>

          {/* Data Source Selection */}
          <div>
            <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">
                2. Data Source Mode
             </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div 
                    onClick={() => setLocalSettings({...localSettings, dataSource: DataSource.SIMULATION})}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all relative overflow-hidden group ${localSettings.dataSource === DataSource.SIMULATION ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}`}
                >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className={`font-bold ${localSettings.dataSource === DataSource.SIMULATION ? 'text-indigo-400' : 'text-slate-300'}`}>Simulation AI</span>
                        {localSettings.dataSource === DataSource.SIMULATION && <Icons.Check />}
                    </div>
                    <p className="text-xs text-slate-500 relative z-10">Generates fake emails using Gemini AI. Perfect for demos.</p>
                </div>

                <div 
                    onClick={() => setLocalSettings({...localSettings, dataSource: DataSource.GMAIL_API})}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all relative overflow-hidden group ${localSettings.dataSource === DataSource.GMAIL_API ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}`}
                >
                     <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className={`font-bold ${localSettings.dataSource === DataSource.GMAIL_API ? 'text-indigo-400' : 'text-slate-300'}`}>Real Gmail API</span>
                        {localSettings.dataSource === DataSource.GMAIL_API && <Icons.Check />}
                    </div>
                    <p className="text-xs text-slate-500 relative z-10">Connects to your actual Gmail Inbox via Token.</p>
                </div>
            </div>

            {/* Manual Token Input Only */}
            {localSettings.dataSource === DataSource.GMAIL_API && (
                <div className="bg-[#18181b] rounded-2xl border border-slate-700 p-5 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-slate-300">Access Token (Required)</label>
                        <a 
                            href="https://developers.google.com/oauthplayground" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
                        >
                            Get Token here ↗
                        </a>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 mb-3 bg-slate-900 p-2 rounded border border-slate-800">
                        1. Go to <b>Google OAuth Playground</b>.<br/>
                        2. Select Scope: <code className="text-indigo-300">https://www.googleapis.com/auth/gmail.readonly</code><br/>
                        3. Authorize & Exchange Authorization Code for Tokens.<br/>
                        4. Copy the <b className="text-white">Access Token</b> (starts with ya29...) and paste below.
                    </p>

                    <textarea
                        value={localSettings.gmailAccessToken}
                        onChange={(e) => setLocalSettings({ ...localSettings, gmailAccessToken: e.target.value })}
                        placeholder="Paste your Access Token here (ya29...)"
                        className="w-full h-24 p-4 bg-black/50 border border-slate-700 rounded-xl text-xs font-mono text-green-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all placeholder-slate-600"
                        spellCheck={false}
                    />
                </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-[#121215] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;