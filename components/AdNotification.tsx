
import React, { useState, useEffect } from 'react';

const ADS = [
  {
    id: 1,
    title: "DigitalOcean Promo",
    highlight: "DigitalOcean 10 Drop",
    description: "Butuh akun DigitalOcean dengan harga terjangkau? Raylan adalah solusinya. Siap pakai, aman, dan terpercaya.",
    price: "IDR 55K",
    color: "from-blue-500 to-cyan-500",
    icon: (
      <svg className="w-5 h-5 text-blue-100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
    )
  },
  {
    id: 2,
    title: "ChatGPT Business",
    highlight: "ChatGPT Bisnis 1 Bulan",
    description: "Tingkatkan produktivitas bisnis Anda. Private Akun, full akses dan aman digunakan.",
    price: "IDR 10K",
    color: "from-green-500 to-emerald-500",
    icon: (
      <svg className="w-5 h-5 text-green-100" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9z"/><path d="M9 10a.5.5 0 0 0-1 0v4a.5.5 0 0 0 1 0v-4zm2 0a.5.5 0 0 0-1 0v4a.5.5 0 0 0 1 0v-4zm4-2a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7a.5.5 0 0 0-.5-.5z" fill="#fff" opacity="0.8"/></svg>
    )
  }
];

const AdNotification: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ADS.length);
        setIsVisible(true);
      }, 500); // Wait for fade out
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAd = ADS[currentIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm pointer-events-none">
      <div 
        className={`pointer-events-auto transform transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <a 
            href="https://wa.me/6285155211577" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block relative group cursor-pointer"
        >
          {/* Animated Glow Border */}
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${currentAd.color} rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 animate-pulse`}></div>
          
          <div className="relative bg-[#0c0c0e]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl transition-transform duration-300 group-hover:-translate-y-1">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${currentAd.color}`}>
                  {currentAd.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Sponsored</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Raylan Official Store</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold bg-white/5 border border-white/10 text-white shadow-inner flex items-center gap-1`}>
                {currentAd.price} <span className="text-slate-400">↗</span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                {currentAd.highlight}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentAd.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div key={currentIndex} className={`h-full bg-gradient-to-r ${currentAd.color} w-full origin-left animate-[progress_8s_linear]`}></div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default AdNotification;
