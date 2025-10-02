import { useState, useEffect } from 'react';

function Countdown({ prayerTimes, darkMode }) {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextPrayer, setNextPrayer] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      const prayers = [
        { name: 'Subuh', time: prayerTimes.subuh },
        { name: 'Dzuhur', time: prayerTimes.dzuhur },
        { name: 'Ashar', time: prayerTimes.ashar },
        { name: 'Magrib', time: prayerTimes.maghrib },
        { name: 'Isya', time: prayerTimes.isya },
      ];

      const prayerTimesInSeconds = prayers.map(prayer => {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        return {
          name: prayer.name,
          seconds: hours * 3600 + minutes * 60
        };
      });

      let next = prayerTimesInSeconds.find(prayer => prayer.seconds > currentTime);
      
      if (!next) {
        next = { name: 'Subuh', seconds: prayerTimesInSeconds[0].seconds + 86400 };
      }

      const diff = next.seconds - currentTime;
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setNextPrayer(next.name);
      setCountdown({ hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={`rounded-3xl p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 border ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/10 shadow-2xl' 
        : 'bg-gradient-to-br from-white/70 to-gray-100/70 border-white/40 shadow-2xl'
    }`}>
      <div className="text-center">
        {/* Current Time */}
        <div className="mb-6">
          <p className={`text-5xl md:text-6xl font-bold font-mono drop-shadow-lg ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {formatTime(currentTime)}
          </p>
        </div>

        {/* Divider */}
        <div className={`w-full h-px my-6 ${
          darkMode ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-400 to-transparent'
        }`}></div>

        {/* Next Prayer Label */}
        <p className={`text-sm font-medium mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Sholat Selanjutnya
        </p>
        
        <h2 className={`text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {nextPrayer}
        </h2>
        
        {/* Countdown */}
        <div className="flex justify-center items-center gap-3 md:gap-4">
          <div className="text-center">
            <div className={`rounded-2xl px-4 md:px-6 py-3 md:py-4 min-w-[70px] md:min-w-[85px] backdrop-blur-md ${
              darkMode ? 'bg-white/10' : 'bg-white/50'
            }`}>
              <p className={`text-4xl md:text-5xl font-bold font-mono ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {String(countdown.hours).padStart(2, '0')}
              </p>
            </div>
            <p className={`text-[10px] md:text-xs mt-2 uppercase tracking-wider font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Jam
            </p>
          </div>
          
          <div className="flex items-center pb-6">
            <p className={`text-3xl md:text-4xl font-bold ${
              darkMode ? 'text-white/50' : 'text-gray-400'
            }`}>:</p>
          </div>
          
          <div className="text-center">
            <div className={`rounded-2xl px-4 md:px-6 py-3 md:py-4 min-w-[70px] md:min-w-[85px] backdrop-blur-md ${
              darkMode ? 'bg-white/10' : 'bg-white/50'
            }`}>
              <p className={`text-4xl md:text-5xl font-bold font-mono ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {String(countdown.minutes).padStart(2, '0')}
              </p>
            </div>
            <p className={`text-[10px] md:text-xs mt-2 uppercase tracking-wider font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Menit
            </p>
          </div>
          
          <div className="flex items-center pb-6">
            <p className={`text-3xl md:text-4xl font-bold ${
              darkMode ? 'text-white/50' : 'text-gray-400'
            }`}>:</p>
          </div>
          
          <div className="text-center">
            <div className={`rounded-2xl px-4 md:px-6 py-3 md:py-4 min-w-[70px] md:min-w-[85px] backdrop-blur-md ${
              darkMode ? 'bg-white/10' : 'bg-white/50'
            }`}>
              <p className={`text-4xl md:text-5xl font-bold font-mono ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {String(countdown.seconds).padStart(2, '0')}
              </p>
            </div>
            <p className={`text-[10px] md:text-xs mt-2 uppercase tracking-wider font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Detik
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`mt-8 h-1.5 rounded-full overflow-hidden ${
          darkMode ? 'bg-white/10' : 'bg-gray-300/50'
        }`}>
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              darkMode ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ 
              width: `${Math.min(100, (countdown.seconds / 60) * 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Countdown;