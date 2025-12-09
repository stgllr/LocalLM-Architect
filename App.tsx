
import React, { useState } from 'react';
import { HardwareSpecs, UseCase, RecommendationResponse } from './types';
import { DEFAULT_HARDWARE } from './constants';
import { runLocalQuery } from './services/localReasoning';
import HardwareDetector from './components/HardwareDetector';
import UseCaseSelector from './components/UseCaseSelector';
import ModelCard from './components/ModelCard';
import ModelExplorer from './components/ModelExplorer';
import { BrainCircuit, ChevronRight, RotateCcw, Search, Sparkles, Zap, TriangleAlert, Database, Loader2, Grid, List } from 'lucide-react';

const App: React.FC = () => {
  const [hardware, setHardware] = useState<HardwareSpecs>(DEFAULT_HARDWARE);
  const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'architect' | 'explorer'>('architect');

  const handleGenerate = async () => {
    if (selectedUseCases.length === 0) {
      return;
    }

    setRecommendations(null);
    
    // Simulated processing stages for better UX
    const stages = [
      { message: 'Analyzing Hardware Profile...', delay: 600 },
      { message: 'Mapping Use Cases to Capabilities...', delay: 800 },
      { message: 'Querying Local Model Database...', delay: 600 },
      { message: 'Calculating Fit Scores & Compatibility...', delay: 800 },
      { message: 'Finalizing Recommendations...', delay: 400 },
    ];

    for (const stage of stages) {
      setLoadingStatus(stage.message);
      await new Promise(resolve => setTimeout(resolve, stage.delay));
    }

    try {
      const data = await runLocalQuery(hardware, selectedUseCases);
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">
      
      {/* Hero Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-800/50 supports-[backdrop-filter]:bg-[#050505]/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                LocalLM <span className="text-indigo-400">Architect</span>
                </h1>
                <p className="text-[10px] text-zinc-500 font-mono tracking-wide">OFFLINE REASONING • PINOKIO</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800">
            <button 
              onClick={() => setViewMode('architect')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${viewMode === 'architect' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Grid size={12} /> Architect
            </button>
            <button 
              onClick={() => setViewMode('explorer')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${viewMode === 'explorer' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <List size={12} /> Explorer
            </button>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-zinc-800 rounded-full bg-zinc-900/50">
                <Database size={12} className="text-emerald-400" />
                <span className="text-[10px] text-zinc-400 font-medium">Local DB Loaded</span>
             </div>
             <button 
               onClick={() => {
                   setRecommendations(null);
                   setHardware(DEFAULT_HARDWARE);
                   setSelectedUseCases([]);
                   setViewMode('architect');
               }}
               className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
             >
               <RotateCcw size={14} /> Reset
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {viewMode === 'architect' && (
          <>
            {/* Intro */}
            <section className="text-center max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs font-medium text-zinc-400 mb-2 hover:border-indigo-500/30 transition-colors cursor-default">
                <Sparkles size={12} className="text-indigo-400" />
                <span>Local Reasoning Engine Active</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Deploy AI Models <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient-x">
                  Locally & Securely
                </span>
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                No API keys required. Our internal engine analyzes your hardware to recommend compatible open-source models with 
                <span className="text-white font-medium"> Pinokio</span> installers and <span className="text-white font-medium">Ollama</span> commands.
              </p>
            </section>

            {/* Controls Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Inputs */}
              <div className="lg:col-span-4 space-y-8 sticky top-24">
                <HardwareDetector hardware={hardware} onChange={setHardware} />
                <UseCaseSelector selected={selectedUseCases} onChange={setSelectedUseCases} />
                
                <div className="pt-4">
                    <button
                    onClick={handleGenerate}
                    disabled={!!loadingStatus || selectedUseCases.length === 0}
                    className={`
                        w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group
                        ${loadingStatus 
                        ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700' 
                        : selectedUseCases.length === 0
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)] hover:scale-[1.01] active:scale-[0.99]'}
                    `}
                    >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                    
                    {loadingStatus ? (
                        <>
                        <Loader2 className="animate-spin" size={20} />
                        <span className="animate-pulse text-sm">{loadingStatus}</span>
                        </>
                    ) : (
                        <>
                        Find Best Models <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                    </button>
                    {selectedUseCases.length === 0 && (
                        <p className="text-center text-xs text-red-400/50 mt-3 flex items-center justify-center gap-1">
                            <TriangleAlert size={12}/> Select at least one use case
                        </p>
                    )}
                </div>
              </div>

              {/* Right Column: Results */}
              <div className="lg:col-span-8 min-h-[600px] flex flex-col">
                {!recommendations && !loadingStatus && (
                  <div className="flex-1 border border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-500 gap-6 p-12 bg-zinc-900/20 backdrop-blur-sm">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-xl">
                        <Search size={40} className="opacity-40" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-semibold text-zinc-300 text-lg">Waiting for Input</p>
                      <p className="text-sm max-w-sm mx-auto">Select your hardware specs and desired AI tasks to generate a personalized architecture report.</p>
                    </div>
                  </div>
                )}

                {loadingStatus && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {/* Status Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[2px]">
                        <div className="bg-zinc-950/90 border border-indigo-500/30 px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                            <div className="relative">
                                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles size={10} className="text-indigo-400 animate-pulse" />
                                </div>
                            </div>
                            <span className="text-sm font-medium text-indigo-100 tracking-wide">{loadingStatus}</span>
                        </div>
                    </div>

                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-0 h-full min-h-[380px] overflow-hidden relative opacity-60">
                        {/* Header Skeleton */}
                        <div className="p-5 border-b border-zinc-800/50 bg-zinc-900/30">
                            <div className="flex justify-between mb-3">
                                <div className="flex gap-2">
                                    <div className="h-4 w-16 bg-zinc-800 rounded-full animate-pulse"></div>
                                    <div className="h-4 w-20 bg-zinc-800 rounded-full animate-pulse"></div>
                                </div>
                                <div className="h-5 w-8 bg-zinc-800 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-14 w-14 bg-zinc-800 rounded-xl animate-pulse shrink-0"></div>
                                <div className="space-y-2 flex-1 pt-1">
                                    <div className="h-5 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
                                    <div className="h-3 w-1/2 bg-zinc-800 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Body Skeleton */}
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="h-10 bg-zinc-800 rounded animate-pulse"></div>
                                <div className="h-10 bg-zinc-800 rounded animate-pulse"></div>
                                <div className="h-10 bg-zinc-800 rounded animate-pulse"></div>
                            </div>
                            <div className="space-y-2 py-2">
                                <div className="h-3 w-full bg-zinc-800 rounded animate-pulse"></div>
                                <div className="h-3 w-5/6 bg-zinc-800 rounded animate-pulse"></div>
                                <div className="h-3 w-4/6 bg-zinc-800 rounded animate-pulse"></div>
                            </div>
                            <div className="h-12 w-full bg-zinc-800 rounded-lg animate-pulse"></div>
                        </div>

                        {/* Footer Skeleton */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800/50 bg-zinc-900/30 flex gap-2">
                            <div className="h-8 flex-1 bg-zinc-800 rounded-lg animate-pulse"></div>
                            <div className="h-8 flex-1 bg-zinc-800 rounded-lg animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {recommendations && !loadingStatus && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                    <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
                      <h3 className="text-indigo-300 font-bold mb-4 flex items-center gap-2 relative z-10 text-lg">
                        <BrainCircuit size={20} /> Architecture Analysis
                      </h3>
                      <div className="space-y-2 relative z-10">
                        <p className="text-zinc-200 text-sm leading-7 font-light tracking-wide">
                            {recommendations.summary}
                        </p>
                        <p className="text-zinc-400 text-xs flex items-center gap-2">
                            <Zap size={12} className="text-yellow-500"/>
                            {recommendations.hardwareNotes}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recommendations.models.map((model) => (
                        <ModelCard key={model.id} model={model} />
                      ))}
                    </div>
                    
                    <div className="flex justify-center pt-8">
                        <p className="text-xs text-zinc-600 flex items-center gap-2">
                            <Database size={12} className="text-zinc-500"/>
                            Powered by LocalLM DB v1.0 • No External Calls
                        </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {viewMode === 'explorer' && (
          <div className="max-w-6xl mx-auto">
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Model Explorer</h2>
                <p className="text-zinc-400">Browse and search the entire local optimization database</p>
             </div>
             <ModelExplorer />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
