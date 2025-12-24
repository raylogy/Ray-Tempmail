import React from 'react';
import { Email } from '../types';
import { Icons } from '../constants';

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
  authError?: boolean;
  onOpenSettings?: () => void;
}

const EmailList: React.FC<EmailListProps> = ({ emails, selectedId, onSelect, loading, authError, onOpenSettings }) => {
  if (authError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20 mb-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h3 className="text-slate-200 font-bold">Authentication Failed</h3>
        <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
           The Gmail Access Token is invalid or has expired. Please update it in settings.
        </p>
        <button 
            onClick={onOpenSettings} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
        >
            Update Token
        </button>
      </div>
    );
  }

  if (loading && emails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
         <div className="relative">
             <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
         </div>
         <p className="text-slate-500 text-xs tracking-wide animate-pulse">SYNCING INBOX...</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center opacity-60">
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
           <Icons.Inbox />
        </div>
        <div>
          <p className="text-slate-400 font-medium">Inbox Empty</p>
          <p className="text-xs text-slate-600 mt-1">Waiting for incoming messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      {emails.map((email) => {
        const isSelected = selectedId === email.id;
        const isSpam = email.tags.includes('SPAM');
        
        return (
          <div
            key={email.id}
            onClick={() => onSelect(email.id)}
            className={`
              relative cursor-pointer py-4 px-6 border-b border-slate-800/40 transition-all duration-200 group
              ${isSelected ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}
            `}
          >
            {/* Active Indicator */}
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            )}

            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                {/* Read/Unread Dot */}
                {!email.read && (
                   <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shrink-0"></div>
                )}
                <span className={`text-sm truncate ${!email.read ? 'text-slate-100 font-semibold' : 'text-slate-400 font-medium'}`}>
                  {email.sender}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2 font-mono mt-0.5">
                {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-1.5">
               {isSpam && (
                 <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                   SPAM
                 </span>
               )}
               <div className={`text-sm truncate w-full ${!email.read ? 'text-indigo-100' : 'text-slate-500'}`}>
                 {email.subject}
               </div>
            </div>
            
            <div className="text-xs text-slate-500/80 truncate font-light">
              {email.snippet}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmailList;