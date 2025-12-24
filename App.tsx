
import React, { useState, useEffect, useCallback } from 'react';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import SettingsModal from './components/SettingsModal';
import IntroLoader from './components/IntroLoader';
import AdNotification from './components/AdNotification';
import WhatsAppWidget from './components/WhatsAppWidget';
import { Icons } from './constants';
import { Email, DataSource, UserSettings } from './types';
import { generateLocalSimulatedEmails } from './services/emailService';
import { fetchGmailMessages } from './services/gmailService';

const DEFAULT_SETTINGS: UserSettings = {
  dataSource: DataSource.SIMULATION,
  googleClientId: '',
  gmailAccessToken: '',
  customDomains: ['masantomail.com', 'temp-inbox.net', 'secure-proxy.io'], 
  activeDomain: 'masantomail.com',
  refreshInterval: 30000,
};

const generateRandomUsername = () => {
  const parts = ['nexus', 'ghost', 'alpha', 'cyber', 'user', 'proxy', 'node', 'void'];
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${parts[Math.floor(Math.random() * parts.length)]}.${suffix}`;
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [username, setUsername] = useState<string>(generateRandomUsername);
  const [copySuccess, setCopySuccess] = useState(false);
  const [gmailAuthError, setGmailAuthError] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');

  const currentDomain = settings.activeDomain || 'masantomail.com';
  const fullEmail = `${username}@${currentDomain}`;
  const selectedEmail = emails.find(e => e.id === selectedId) || null;

  const refreshEmails = useCallback(async (isInitial: boolean = false) => {
    setLoading(true);
    setGmailAuthError(false);
    try {
      if (settings.dataSource === DataSource.SIMULATION) {
        // Menggunakan generator lokal sederhana, bukan Gemini AI
        const newEmails = generateLocalSimulatedEmails(isInitial ? 3 : 1, fullEmail);
        setEmails(prev => isInitial ? newEmails : [...newEmails, ...prev]);
      } else {
        if (!settings.gmailAccessToken) {
          setLoading(false);
          return;
        }
        const realEmails = await fetchGmailMessages(settings.gmailAccessToken, 20, `to:${fullEmail}`);
        setEmails(realEmails);
      }
    } catch (error: any) {
      if (error.message === 'GMAIL_AUTH_ERROR') setGmailAuthError(true);
    } finally {
      setLoading(false);
    }
  }, [settings.dataSource, settings.gmailAccessToken, fullEmail]);

  useEffect(() => {
    if (!showIntro) refreshEmails(true);
  }, [username, currentDomain, showIntro, refreshEmails]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(fullEmail);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <>
      {showIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
      
      <div className={`flex h-screen w-screen bg-[#020617] text-slate-200 overflow-hidden font-inter transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Sidebar */}
        <div className={`${selectedId ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] flex-col border-r border-slate-800/50 bg-[#0b0f1a] relative`}>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <Icons.Shield />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">MASANTO MAIL</h1>
              </div>
              <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                <Icons.Settings />
              </button>
            </div>

            {/* Email Address Card */}
            <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Your Temp Identity</span>
                <select 
                  value={currentDomain} 
                  onChange={(e) => setSettings({...settings, activeDomain: e.target.value})}
                  className="bg-transparent text-indigo-400 text-xs font-bold outline-none cursor-pointer"
                >
                  {settings.customDomains.map(d => <option key={d} value={d} className="bg-slate-900 text-white">@{d}</option>)}
                </select>
              </div>
              
              <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-slate-800 group">
                {isEditingUsername ? (
                  <input 
                    autoFocus 
                    value={tempUsername} 
                    onChange={e => setTempUsername(e.target.value)}
                    onBlur={() => {setUsername(tempUsername || username); setIsEditingUsername(false);}}
                    className="bg-transparent flex-1 text-sm text-white font-mono outline-none"
                  />
                ) : (
                  <span className="flex-1 text-sm font-mono truncate text-indigo-100">{username}</span>
                )}
                <div className="flex gap-1">
                  <button onClick={() => {setTempUsername(username); setIsEditingUsername(true);}} className="p-1.5 hover:text-indigo-400 text-slate-500 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button onClick={handleCopyEmail} className="p-1.5 hover:text-green-400 text-slate-500 transition-colors">
                    {copySuccess ? <Icons.Check /> : <Icons.Copy />}
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setUsername(generateRandomUsername())}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Icons.Refresh /> GENERATE NEW
              </button>
            </div>
          </div>

          <div className="px-6 py-2 border-b border-slate-800/50 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Inbox • {emails.length} Messages</span>
            <button onClick={() => refreshEmails(false)} disabled={loading} className={`${loading ? 'animate-spin' : ''} hover:text-white`}>
              <Icons.Refresh />
            </button>
          </div>

          <EmailList 
            emails={emails} 
            selectedId={selectedId} 
            onSelect={setSelectedId} 
            loading={loading}
            authError={gmailAuthError}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>

        {/* Main View */}
        <main className={`${!selectedId ? 'hidden md:flex' : 'flex'} flex-1 bg-[#020617] relative`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.1),transparent)] pointer-events-none"></div>
          <EmailDetail email={selectedEmail} onCloseMobile={() => setSelectedId(null)} />
        </main>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          settings={settings}
          onSave={(s) => {setSettings(s); refreshEmails(true);}}
        />

        {/* Branding & Widgets */}
        <AdNotification />
        <WhatsAppWidget />
      </div>
    </>
  );
};

export default App;
