import { useState, useEffect } from 'react';
import axios from 'axios';
import LocationSelector from './components/LocationSelector';
import PrayerTimes from './components/PrayerTimes';
import Countdown from './components/Countdown';
import lightBg from './assets/bg-light-mosque.jpeg'; // Gambar latar terang
import darkBg from './assets/bg-dark-mosque.jpeg';   // Gambar latar gelap

function App() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('1219'); // Default Kota Bandung
  const [prayerData, setPrayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch daftar kota
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('https://api.myquran.com/v2/sholat/kota/semua');
        setCities(response.data.data);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };
    fetchCities();
  }, []);

  // Fetch jadwal sholat berdasarkan kota yang dipilih
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        
        const response = await axios.get(
          `https://api.myquran.com/v2/sholat/jadwal/${selectedCity}/${year}/${month}/${date}`
        );
        
        setPrayerData(response.data.data);
      } catch (err) {
        setError('Gagal mengambil data jadwal sholat');
        console.error('Error fetching prayer times:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCity) {
      fetchPrayerTimes();
    }
  }, [selectedCity]);

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Background images from Unsplash (Islamic/Mosque themed)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ 
          backgroundImage: `url(${darkMode ? darkBg : lightBg})`,
        }}
      >
        <div className={`absolute inset-0 transition-all duration-700 ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-900/85 via-blue-900/75 to-slate-900/85' 
            : 'bg-gradient-to-br from-white/80 via-blue-50/85 to-white/80'
        }`}></div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 md:mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Jadwal Sholat di {prayerData?.lokasi?.toUpperCase() || 'Loading...'}
            </h1>
            <LocationSelector
              cities={cities}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              darkMode={darkMode}
            />
          </div>
          
          <div className={`text-right backdrop-blur-md rounded-2xl p-4 ${
            darkMode ? 'bg-white/10' : 'bg-white/50'
          }`}>
            <p className={`text-base md:text-lg font-medium mb-1 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {formatDate(new Date())}
            </p>
            {prayerData && (
              <p className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {prayerData.jadwal.tanggal}
              </p>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-md ${
                darkMode 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-gray-900/20 text-gray-900 hover:bg-gray-900/30'
              }`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`text-center py-20 backdrop-blur-md rounded-3xl ${
            darkMode ? 'bg-white/10' : 'bg-white/50'
          }`}>
            <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${
              darkMode ? 'border-white/30' : 'border-gray-900/30'
            }`}></div>
            <p className={`mt-4 font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Memuat jadwal sholat...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`rounded-xl px-6 py-4 backdrop-blur-md ${
            darkMode 
              ? 'bg-red-500/20 border border-red-400/30 text-red-200' 
              : 'bg-red-100/80 border border-red-300 text-red-800'
          }`}>
            {error}
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && prayerData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
            {/* Left: Prayer Times */}
            <div className="lg:col-span-1 space-y-3">
              <PrayerTimes 
                prayerData={prayerData} 
                darkMode={darkMode}
                side="left"
              />
            </div>

            {/* Center: Countdown */}
            <div className="lg:col-span-1">
              <Countdown 
                prayerTimes={prayerData.jadwal} 
                darkMode={darkMode}
              />
            </div>

            {/* Right: Prayer Times */}
            <div className="lg:col-span-1 space-y-3">
              <PrayerTimes 
                prayerData={prayerData} 
                darkMode={darkMode}
                side="right"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <p className={`text-center mt-13 text-xs md:text-sm font-medium drop-shadow ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {/* Data dari API MyQuran */}
        </p>
      </div>
    </div>
  );
}

export default App;