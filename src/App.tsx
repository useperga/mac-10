import React, { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';

export default function App() {
  const [deviceFrame, setDeviceFrame] = useState<'fluid' | 'iphone' | 'android'>('fluid');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Üst Cihaz / Önizleme Kontrol Çubuğu */}
      <div className="bg-slate-950/80 backdrop-blur border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none z-50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-200">Türk Maç Rehberi</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">Expo / React Native TypeScript Mimarisi</span>
        </div>

        {/* Cihaz Çerçevesi Seçici */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setDeviceFrame('fluid')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              deviceFrame === 'fluid'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tam ekran akıcı görünüm"
          >
            Tam Genişlik
          </button>
          <button
            onClick={() => setDeviceFrame('iphone')}
            className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
              deviceFrame === 'iphone'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="iOS iPhone Görünümü"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 3.5c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.66 1.37-.56.65-.98 1.72-.85 2.74 1.03.08 2.06-.55 2.59-1.26z" />
            </svg>
            iPhone
          </button>
          <button
            onClick={() => setDeviceFrame('android')}
            className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
              deviceFrame === 'android'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Android Görünümü"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4111 13.8533 8.077 12 8.077c-1.8533 0-3.5902.3341-5.1368.8727L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
            </svg>
            Android
          </button>
        </div>
      </div>

      {/* Önizleme Alanı */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 bg-slate-950 overflow-y-auto">
        {deviceFrame === 'fluid' ? (
          <div className="w-full h-full min-h-[calc(100vh-45px)] bg-slate-50 text-slate-900 shadow-2xl">
            <HomeScreen />
          </div>
        ) : (
          <div
            className={`my-auto relative shadow-2xl overflow-hidden transition-all duration-300 border-[10px] ${
              deviceFrame === 'iphone'
                ? 'w-[393px] h-[844px] rounded-[52px] border-slate-800 bg-slate-50'
                : 'w-[380px] h-[820px] rounded-[36px] border-slate-800 bg-slate-50'
            }`}
          >
            {/* Dynamic Island / Kamera Çentiği */}
            {deviceFrame === 'iphone' ? (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-40 flex items-center justify-end px-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90 border border-slate-800" />
              </div>
            ) : (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-40" />
            )}

            {/* Cihaz Ekran İçeriği */}
            <div className="w-full h-full overflow-y-auto pt-6 text-slate-900 bg-slate-50">
              <HomeScreen />
            </div>

            {/* Alt Çizgi (Home Bar) */}
            {deviceFrame === 'iphone' && (
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/40 rounded-full z-40 pointer-events-none" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
