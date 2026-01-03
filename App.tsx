
import React, { useState, useCallback } from 'react';
import { fetchPlaceIntelligence } from './services/geminiService';
import { PlaceIntelligence, AppStatus } from './types';
import Logo from './components/Logo';
import SectionCard from './components/SectionCard';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<PlaceIntelligence | null>(null);
  
  const handleSearch = useCallback(async (query?: string) => {
    const finalQuery = (query || searchQuery).trim();
    if (!finalQuery) return;

    setStatus(AppStatus.LOADING);
    const result = await fetchPlaceIntelligence(finalQuery);
    setData(result);
    setStatus(AppStatus.SUCCESS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (status === AppStatus.LOADING) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen selection:bg-amber-100">
      {status === AppStatus.IDLE && (
        <div className="h-screen flex flex-col justify-center items-center px-6 bg-yaxtra-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#FF9933_0%,transparent_40%),radial-gradient(circle_at_80%_70%,#4169E1_0%,transparent_40%)]"></div>
          </div>

          <div className="relative z-10 w-full max-w-4xl text-center space-y-12 animate-in fade-in zoom-in duration-700">
            <div className="scale-125 mb-8 inline-block">
              <Logo light />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight leading-tight">
                Explore <span className="text-saffron italic">Every Corner</span> <br/> of Bharat.
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
                Deep intelligence for cities, towns, and the smallest villages.
              </p>
            </div>

            <div className="relative w-full max-w-2xl mx-auto group">
              <input
                type="text"
                placeholder="Search any place in India..."
                className="w-full py-7 pl-10 pr-32 rounded-[2.5rem] bg-white text-slate-900 text-xl font-semibold focus:outline-none search-shadow group-hover:scale-[1.01] transition-transform placeholder:text-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
              />
              <button 
                onClick={() => handleSearch()}
                className="absolute right-3 top-3 bottom-3 bg-yaxtra-gradient text-white px-10 rounded-[2rem] font-black text-lg hover:brightness-110 active:scale-95 transition-all shadow-xl"
              >
                Go
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {['Varanasi', 'Munnar', 'Hampi', 'Leh', 'Meerut', 'Tawang'].map(place => (
                <button 
                  key={place}
                  onClick={() => handleSearch(place)}
                  className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-full text-sm font-bold backdrop-blur-sm border border-white/10 transition-colors"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-10 text-slate-600 text-[10px] font-black tracking-[0.4em] uppercase">
            YAXTRA INTELLIGENCE SYSTEMS • v2.1
          </div>
        </div>
      )}

      {status === AppStatus.SUCCESS && data && (
        <div className="min-h-screen bg-slate-50/50 pb-20">
          <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-100 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div onClick={() => { setStatus(AppStatus.IDLE); setSearchQuery(''); }} className="cursor-pointer hover:opacity-80 transition-opacity">
                <Logo />
              </div>
              <div className="flex-1 max-w-md mx-8 hidden lg:block">
                <input
                  type="text"
                  placeholder="Analyze another destination..."
                  className="w-full bg-slate-100 border-none rounded-full py-2.5 px-6 text-sm font-bold focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-slate-400"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value) }}
                />
              </div>
              <button 
                onClick={() => { setStatus(AppStatus.IDLE); setSearchQuery(''); }}
                className="bg-slate-900 text-white font-black text-[10px] tracking-widest px-8 py-3.5 rounded-full hover:bg-slate-800 transition-all shadow-xl"
              >
                NEW SEARCH
              </button>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-20 animate-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full shadow-2xl">
                  Deep Intelligence Feed
                </span>
                {(data.state || data.district) && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest border border-amber-200/50">
                    {data.district ? `${data.district}, ` : ''}{data.state}
                  </span>
                )}
                {data.alternateNames.length > 0 && (
                  <span className="bg-white text-slate-400 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest border border-slate-100">
                    Aliases: {data.alternateNames.join(' • ')}
                  </span>
                )}
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif text-slate-900 font-black tracking-tight mb-8 leading-tight">{data.placeName}</h1>
              <p className="text-xl md:text-3xl text-slate-500 font-light italic mb-12 max-w-5xl leading-tight">"{data.tagline}"</p>
              
              <div className="bg-white p-12 md:p-16 rounded-[3.5rem] shadow-sm border border-slate-50 text-xl md:text-2xl text-slate-700 leading-relaxed max-w-6xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 p-24 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01705V13H11.017C12.1216 13 13.017 12.1046 13.017 11V8C13.017 6.89543 12.1216 6 11.017 6H5.01705C3.91248 6 3.01705 6.89543 3.01705 8V14C3.01705 15.1046 3.91248 16 5.01705 16H6.01705V19C6.01705 20.1046 6.91248 21 8.01705 21H14.017ZM21.017 21L21.017 18C21.017 16.8954 20.1216 16 19.017 16H16.017V13H18.017C19.1216 13 20.017 12.1046 20.017 11V8C20.017 6.89543 19.1216 6 18.017 6H12.017C10.9125 6 10.017 6.89543 10.017 8V14C10.017 15.1046 10.9125 16 12.017 16H13.017V19C13.017 20.1046 13.9125 21 15.017 21H21.017Z"/></svg>
                </div>
                <div className="relative z-10">
                  {data.overview}
                </div>
                {data.regionalContext && (
                  <p className="mt-12 text-slate-400 text-sm font-black uppercase tracking-[0.3em] border-t pt-10 flex items-center gap-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span>
                    {data.regionalContext}
                  </p>
                )}
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
              {/* Full Results: Tourist Places */}
              <SectionCard title="Sightseeing & Tourist Sites" icon="🗺️">
                <div className="space-y-8">
                  {data.placesToVisit.map((place, i) => (
                    <div key={i} className="group border-b border-slate-50 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-black text-slate-900 text-lg group-hover:text-saffron transition-colors leading-tight">{place.name}</p>
                        <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shrink-0">{place.type}</span>
                      </div>
                      <p className="text-sm text-slate-500 font-bold leading-relaxed">{place.description}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Full Results: Local Food */}
              <SectionCard title="Local Food & Specialties" icon="🥘">
                <div className="space-y-8">
                  {data.localFood.map((food, i) => (
                    <div key={i} className="pb-6 border-b border-slate-50 last:border-0 last:pb-0 group">
                      <p className="font-black text-slate-900 text-lg mb-2 group-hover:text-saffron transition-colors">{food.dishName}</p>
                      <p className="text-sm text-slate-500 font-bold leading-relaxed">{food.description}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Full Results: Spiritual Sites */}
              <SectionCard title="Spiritual Foundations" icon="🛕">
                <div className="space-y-6">
                  {data.religiousAndSpiritual.map((site, i) => (
                    <div key={i} className="bg-slate-50/50 p-7 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-amber-200 transition-all shadow-sm">
                      <p className="font-black text-slate-900 text-lg mb-2 leading-tight">{site.name}</p>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">{site.significance}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Culture & Lifestyle */}
              <SectionCard title="Culture & Heritage" icon="🎭">
                <div className="space-y-10">
                  <div className="group border-l-2 border-slate-50 pl-6 hover:border-saffron transition-all">
                    <p className="text-[10px] font-black uppercase text-slate-300 mb-3 tracking-[0.2em] group-hover:text-saffron transition-colors">Traditions</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{data.cultureAndLifestyle.traditions}</p>
                  </div>
                  <div className="group border-l-2 border-slate-50 pl-6 hover:border-saffron transition-all">
                    <p className="text-[10px] font-black uppercase text-slate-300 mb-3 tracking-[0.2em] group-hover:text-saffron transition-colors">Daily Pulse</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{data.cultureAndLifestyle.lifestyle}</p>
                  </div>
                  <div className="group border-l-2 border-slate-50 pl-6 hover:border-saffron transition-all">
                    <p className="text-[10px] font-black uppercase text-slate-300 mb-3 tracking-[0.2em] group-hover:text-saffron transition-colors">Festivals</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{data.cultureAndLifestyle.festivals}</p>
                  </div>
                  <div className="group border-l-2 border-slate-50 pl-6 hover:border-saffron transition-all">
                    <p className="text-[10px] font-black uppercase text-slate-300 mb-3 tracking-[0.2em] group-hover:text-saffron transition-colors">Regional Attire</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{data.cultureAndLifestyle.clothing}</p>
                  </div>
                </div>
              </SectionCard>

              {/* Full Results: Famous Bazaars */}
              <SectionCard title="Bazaars & Markets" icon="🛍️">
                <div className="space-y-8">
                  {data.famousMarkets.map((market, i) => (
                    <div key={i} className="pb-6 border-b border-slate-50 last:border-0 last:pb-0 group">
                      <p className="font-black text-slate-900 text-lg mb-2 group-hover:text-saffron transition-colors">{market.name}</p>
                      <p className="text-sm text-slate-500 font-bold leading-relaxed">{market.description}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Full Results: Greetings & Protocols */}
              <SectionCard title="Greetings & Protocol" icon="🙏">
                <div className="space-y-12">
                  {data.greetingsAndEtiquette.map((greet, i) => (
                    <div key={i} className="border-l-4 border-slate-100 pl-8 hover:border-saffron transition-all group">
                      <p className="text-4xl font-black text-slate-900 mb-2 group-hover:text-saffron transition-colors">{greet.phrase}</p>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">{greet.meaning}</p>
                      <p className="text-sm text-slate-500 font-bold italic leading-relaxed">"{greet.usage}"</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Wide Intelligence Logistics Section */}
              <div className="lg:col-span-3">
                <SectionCard title="Travel Intelligence Log" icon="✈️">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-8">
                    <div className="space-y-6">
                      <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] border-b pb-4">Optimal Season</p>
                      <p className="text-2xl font-black text-slate-800 leading-tight">{data.travelTips.bestTime}</p>
                    </div>
                    <div className="space-y-6">
                      <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] border-b pb-4">Accessibility</p>
                      <p className="text-2xl font-black text-slate-800 leading-tight">{data.travelTips.transport}</p>
                    </div>
                    <div className="space-y-6">
                      <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] border-b pb-4">Field Etiquette</p>
                      <ul className="space-y-4">
                        {data.travelTips.etiquette.map((e, i) => (
                          <li key={i} className="text-sm font-bold text-slate-600 flex gap-4">
                            <span className="text-saffron text-2xl leading-none">•</span> {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </div>
          </main>
          
          <footer className="bg-white border-t border-slate-100 py-32 mt-32">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
              <Logo />
              <p className="mt-12 text-slate-400 text-sm font-bold max-w-2xl leading-loose tracking-tight">
                YAXTRA provides high-fidelity, comprehensive intelligence for travel across India. Our systems decode the cultural, culinary, and logistical DNA of the subcontinent to empower travelers.
              </p>
              <div className="mt-20 flex flex-wrap justify-center gap-16 text-slate-500 font-black text-[11px] uppercase tracking-[0.6em]">
                <a href="#" className="hover:text-saffron transition-all">API Access</a>
                <a href="#" className="hover:text-saffron transition-all">Regional Hubs</a>
                <a href="#" className="hover:text-saffron transition-all">Global Partners</a>
                <a href="#" className="hover:text-saffron transition-all">Connect</a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
