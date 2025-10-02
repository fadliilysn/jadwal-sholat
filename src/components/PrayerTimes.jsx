import { useState, useEffect } from 'react';

function PrayerTimes({ prayerData, darkMode, side }) {
  const [currentPrayer, setCurrentPrayer] = useState(null);

  const allPrayers = [
    { name: 'Subuh', time: prayerData.jadwal.subuh, icon: '🌅' },
    { name: 'Terbit', time: prayerData.jadwal.terbit, isExtra: true, subtitle: 'Matahari Terbit', icon: '🌄' },
    { name: 'Dzuhur', time: prayerData.jadwal.dzuhur, icon: '☀️' },
    { name: 'Ashar', time: prayerData.jadwal.ashar, icon: '🌤️' },
    { name: 'Magrib', time: prayerData.jadwal.maghrib, icon: '🌆' },
    { name: 'Isya', time: prayerData.jadwal.isya, icon: '🌙' },
  ];

  // Split prayers for left and right columns
  const prayers = side === 'left'
    ? allPrayers.slice(0, 3) // Subuh, Terbit, Dzuhur
    : allPrayers.slice(3); // Ashar, Magrib, Isya

  useEffect(() => {
    const checkCurrentPrayer = () => {
      const now = new Date();
      const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      const mainPrayers = allPrayers.filter(p => !p.isExtra);
      
      for (let i = 0; i < mainPrayers.length; i++) {
        const [hours, minutes] = mainPrayers[i].time.split(':').map(Number);
        const prayerSeconds = hours * 3600 + minutes * 60;
        
        const nextIndex = (i + 1) % mainPrayers.length;
        const [nextHours, nextMinutes] = mainPrayers[nextIndex].time.split(':').map(Number);
        let nextPrayerSeconds = nextHours * 3600 + nextMinutes * 60;
        
        if (nextIndex === 0) {
          nextPrayerSeconds += 86400;
        }

        if (currentSeconds >= prayerSeconds && currentSeconds < nextPrayerSeconds) {
          setCurrentPrayer(mainPrayers[i].name);
          break;
        }
      }
    };

    checkCurrentPrayer();
    const interval = setInterval(checkCurrentPrayer, 60000);
    return () => clearInterval(interval);
  }, [prayerData]);

  return (
    <>
      {prayers.map((prayer) => {
        const isCurrentPrayer = currentPrayer === prayer.name;
        
        return (
          <div
            key={prayer.name}
            className={`rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 border ${
              isCurrentPrayer
                ? darkMode
                  ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-emerald-400/50 shadow-xl shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-300 shadow-xl shadow-emerald-500/20'
                : darkMode
                ? 'bg-white/10 border-white/20 hover:bg-white/15'
                : 'bg-white/60 border-white/40 hover:bg-white/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${isCurrentPrayer ? 'animate-pulse' : ''}`}>
                  {prayer.icon}
                </span>
                <div>
                  <h3 className={`text-lg md:text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {prayer.name}
                  </h3>
                  {prayer.subtitle && (
                    <p className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {prayer.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <p className={`text-2xl md:text-3xl font-bold font-mono ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {prayer.time}
              </p>
            </div>
            
            {isCurrentPrayer && !prayer.isExtra && (
              <div className={`mt-3 pt-3 border-t text-center ${
                darkMode ? 'border-white/20' : 'border-gray-300'
              }`}>
                <span className={`text-xs font-semibold uppercase tracking-wider ${
                  darkMode ? 'text-emerald-300' : 'text-emerald-700'
                }`}>
                  ● Sedang Berlangsung
                </span>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default PrayerTimes;