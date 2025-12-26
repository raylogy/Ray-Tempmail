
import React from 'react';
import { Email } from '../types';
import { Icons } from '../constants';

interface EmailDetailProps {
  email: Email | null;
  onCloseMobile: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = ({ email, onCloseMobile }) => {
  if (!email) {
    return (
      <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-black/50">
            <div className="text-slate-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            </div>
            <h3 className="text-slate-200 font-bold text-lg mb-2">Private Secure Inbox</h3>
            <p className="text-slate-500 text-sm max-w-xs text-center leading-relaxed">
            Pilih email dari daftar untuk membaca isinya. Semua data dienkripsi dan aman.
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>

      {/* Header Section */}
      <div className="relative z-10 px-8 pt-8 pb-6 border-b border-white/5">
        
        {/* Mobile Back Button */}
        <div className="md:hidden mb-4">
            <button onClick={onCloseMobile} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                ← Kembali ke Inbox
            </button>
        </div>

        {/* Toolbar & Actions */}
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                    Safe Message
                </span>
            </div>
            <div className="flex gap-3">
                <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-slate-700" title="Reply">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                </button>
                <button className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20" title="Delete">
                    <Icons.Trash />
                </button>
            </div>
        </div>

        {/* Subject */}
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-6 tracking-tight">
            {email.subject}
        </h1>

        {/* Sender Info Card */}
        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                {email.sender.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                    <span className="text-white font-semibold truncate">{email.sender}</span>
                    <span className="text-slate-500 text-xs truncate">&lt;{email.senderEmail}&gt;</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    {new Date(email.date).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'medium' })}
                </div>
            </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 scroll-smooth custom-scrollbar">
        
        {/* Email Body Container */}
        <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-slate-800"></div>
            <div className="pl-6 pb-20">
                <div 
                    className="
                        prose prose-invert max-w-none 
                        prose-p:text-slate-300 prose-a:text-indigo-400 prose-headings:text-slate-200 prose-strong:text-white
                        font-sans text-sm leading-relaxed
                        [&_a]:underline [&_a]:underline-offset-4
                    "
                >
                    <div dangerouslySetInnerHTML={{ __html: email.body }} />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default EmailDetail;
