
import React, { useState } from 'react';
import { MODEL_DB } from '../data/localModels';
import { Search, Filter, ShieldCheck, Download, Cpu, Star } from 'lucide-react';

const ModelExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState<string>('All');

  const providers = ['All', ...Array.from(new Set(MODEL_DB.map(m => m.provider)))].sort();

  const filteredModels = MODEL_DB.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = providerFilter === 'All' || model.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const getQualityBadge = (quality: string | undefined) => {
    if (!quality) return null;
    
    let colors = 'bg-zinc-800 text-zinc-400 border-zinc-700';
    if (quality === 'Exceptional') colors = 'bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-[0_0_10px_-4px_rgba(168,85,247,0.3)]';
    if (quality === 'Excellent') colors = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    if (quality === 'Very Good') colors = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    if (quality === 'Good') colors = 'bg-amber-500/10 text-amber-300 border-amber-500/20';

    return (
      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${colors} flex items-center gap-1 w-fit`}>
        {quality === 'Exceptional' && <Star size={8} className="fill-purple-300" />}
        {quality}
      </span>
    );
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls */}
      <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Filter size={20} className="text-indigo-400" /> Model Database
        </h2>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50"
          >
            {providers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/50 border-b border-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <th className="px-6 py-4">Model Name</th>
              <th className="px-6 py-4">Quality Rating</th>
              <th className="px-6 py-4">Size & Type</th>
              <th className="px-6 py-4">Hardware Req</th>
              <th className="px-6 py-4">Capabilities</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {filteredModels.map((model) => (
              <tr key={model.name} className="hover:bg-zinc-800/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-200 group-hover:text-indigo-300 transition-colors">{model.name}</span>
                    <span className="text-xs text-zinc-500 mt-0.5">{model.publisher}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getQualityBadge(model.quality)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-300 font-mono">{model.params_b}B Params</span>
                    <span className="text-[10px] text-zinc-500 uppercase">{model.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${model.min_hardware.gpu_vram_gb <= 8 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {model.min_hardware.gpu_vram_gb}GB VRAM
                    </span>
                    {model.apple_silicon_optimized && (
                      <Cpu size={14} className="text-indigo-400" title="Apple Silicon Optimized" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {model.tasks.slice(0, 3).map(task => (
                      <span key={task} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400 border border-zinc-700/50">
                        {task}
                      </span>
                    ))}
                    {model.tasks.length > 3 && (
                      <span className="text-[10px] text-zinc-600">+{model.tasks.length - 3}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-zinc-800 text-center text-xs text-zinc-500">
        Showing {filteredModels.length} models from local database
      </div>
    </div>
  );
};

export default ModelExplorer;
