
import React, { useState } from 'react';
import { ModelRecommendation } from '../types';
import { Terminal, Download, Cpu, Star, Box, Zap, Copy, Search, ExternalLink, Command, Cloud, BookOpen, Layers } from 'lucide-react';

interface Props {
  model: ModelRecommendation;
}

type InstallMethod = 'pinokio' | 'ollama' | 'lmstudio' | 'llamacpp' | 'mlx';

const ModelCard: React.FC<Props> = ({ model }) => {
  const [copied, setCopied] = useState(false);
  const [activeMethod, setActiveMethod] = useState<InstallMethod>(
    model.appleSiliconOptimized ? 'mlx' :
    (model.pinokioLink ? 'pinokio' : (model.ollamaCommand ? 'ollama' : 'lmstudio'))
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodContent = () => {
    switch (activeMethod) {
      case 'pinokio':
        return {
          content: model.pinokioLink || "Not available for Pinokio",
          type: 'link',
          icon: <Zap size={14} />,
          label: '1-Click Install'
        };
      case 'ollama':
        return {
          content: model.ollamaCommand || "ollama pull " + model.name.toLowerCase(),
          type: 'command',
          icon: <Terminal size={14} />,
          label: 'Pull Command'
        };
      case 'lmstudio':
        return {
          content: model.lmStudioCommand || `Search "${model.name}"`,
          type: 'text',
          icon: <Search size={14} />,
          label: 'Search Query'
        };
      case 'llamacpp':
        return {
          content: model.llamaCppCommand || `./main -m ${model.name}.gguf -p "User:"`,
          type: 'command',
          icon: <Command size={14} />,
          label: 'Run Command'
        };
      case 'mlx':
        return {
          content: model.installCommand || `pip install mlx-lm`,
          type: 'command',
          icon: <Cpu size={14} />,
          label: 'MLX Command'
        };
    }
  };

  const methodData = getMethodContent();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)] flex flex-col h-full group relative">
      
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>

      {/* Header */}
      <div className="p-5 border-b border-zinc-800/50 relative bg-gradient-to-b from-zinc-800/20 to-transparent">
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2 items-center flex-wrap">
            {model.tags && model.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                {tag}
              </span>
            ))}
            {model.appleSiliconOptimized && (
               <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                 <Cpu size={10} className="text-indigo-300" /> MLX Optimized
               </span>
            )}
            {model.pinokioLink && (
               <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black text-emerald-400 border border-emerald-900/30 flex items-center gap-1">
                 <Zap size={10} className="fill-emerald-400" /> Pinokio
               </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-950/50 rounded-full px-2 py-1 border border-zinc-800">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-white">{model.score.toFixed(0)}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/20">
            <Box className="text-white" size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight tracking-tight">{model.name}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-zinc-400">
               <span className="flex items-center gap-1"><Cpu size={10} /> {model.sizeParams}</span>
               <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
               {/* Provider / Publisher Display */}
               <span className="text-indigo-200">{model.provider}</span>
               {model.publisher !== model.provider && (
                  <>
                     <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                     <span className="opacity-70">{model.publisher}</span>
                  </>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Tech Specs */}
        <div className="grid grid-cols-3 gap-2">
           <div className="bg-zinc-950/50 border border-zinc-800/50 rounded p-2 text-center">
              <span className="block text-[10px] text-zinc-500 uppercase font-bold">RAM Req</span>
              <span className="text-sm font-semibold text-indigo-300">{model.vramReq} GB</span>
           </div>
           <div className="bg-zinc-950/50 border border-zinc-800/50 rounded p-2 text-center">
              <span className="block text-[10px] text-zinc-500 uppercase font-bold">Quant</span>
              <span className="text-sm font-semibold text-emerald-300">{model.recommendedQuantization}</span>
           </div>
           <div className="bg-zinc-950/50 border border-zinc-800/50 rounded p-2 text-center">
              <span className="block text-[10px] text-zinc-500 uppercase font-bold">Backend</span>
              <span className="text-sm font-semibold text-amber-300 uppercase">{model.backend}</span>
           </div>
        </div>

        {/* Libraries & Frameworks Badges */}
        {model.libraries && model.libraries.length > 0 && (
           <div className="flex flex-wrap gap-1.5">
             {model.libraries.map(lib => (
                <span key={lib} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-zinc-800/50 border border-zinc-700 rounded text-zinc-400">
                   <Layers size={9} /> {lib}
                </span>
             ))}
           </div>
        )}

        <p className="text-sm text-zinc-400 leading-relaxed border-l-2 border-zinc-800 pl-3">
          {model.description}
        </p>
        
        <div className="bg-indigo-900/10 border border-indigo-500/10 rounded-lg p-3">
           <p className="text-xs text-indigo-200/80 flex items-start gap-2">
             <Zap size={14} className="mt-0.5 shrink-0 text-indigo-400" />
             <span className="italic">"{model.reason}"</span>
           </p>
        </div>

        {/* Cloud Availability */}
        {model.providers && model.providers.length > 0 && (
           <div className="bg-zinc-950 border border-zinc-800/60 rounded px-3 py-2">
              <div className="flex items-center gap-1.5 mb-2 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                 <Cloud size={10} /> Also Available On
              </div>
              <div className="flex flex-wrap gap-1.5">
                 {model.providers.slice(0, 4).map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 bg-zinc-800/40 text-zinc-400 rounded hover:text-zinc-300 transition-colors cursor-default">
                       {p}
                    </span>
                 ))}
                 {model.providers.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800/20 text-zinc-500 rounded">
                       +{model.providers.length - 4} more
                    </span>
                 )}
              </div>
           </div>
        )}
        
        {/* HF Direct Links */}
        <div className="flex gap-2 mt-2">
             {model.hfUrl && (
                <a href={model.hfUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-[10px] flex items-center justify-center gap-1.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition-colors">
                    <ExternalLink size={10} /> HuggingFace
                </a>
             )}
             {model.hfGGUF && (
                <a href={model.hfGGUF} target="_blank" rel="noopener noreferrer" className="flex-1 text-[10px] flex items-center justify-center gap-1.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition-colors">
                    <Download size={10} /> GGUF
                </a>
             )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="bg-zinc-950/30 border-t border-zinc-800 mt-auto backdrop-blur-sm">
        
        {/* Install Method Tabs */}
        <div className="flex border-b border-zinc-800/50">
           {model.appleSiliconOptimized ? (
             <button
                onClick={() => setActiveMethod('mlx')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] uppercase font-bold tracking-wide transition-colors ${activeMethod === 'mlx' ? 'text-indigo-400 bg-indigo-500/5 border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
                <Cpu size={12} /> MLX
             </button>
           ) : null}
           
           {[
             { id: 'pinokio', icon: <Zap size={12} />, label: 'Pinokio', disabled: !model.pinokioLink },
             { id: 'ollama', icon: <Terminal size={12} />, label: 'Ollama', disabled: !model.ollamaCommand },
             { id: 'lmstudio', icon: <Search size={12} />, label: 'LM Studio', disabled: !model.lmStudioCommand },
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => !tab.disabled && setActiveMethod(tab.id as InstallMethod)}
               disabled={tab.disabled}
               className={`
                 flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] uppercase font-bold tracking-wide transition-colors
                 ${activeMethod === tab.id 
                    ? 'text-indigo-400 bg-indigo-500/5 border-b-2 border-indigo-500' 
                    : tab.disabled 
                      ? 'text-zinc-700 cursor-not-allowed' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
               `}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {/* Action Content */}
        <div className="p-4 space-y-3">
          {methodData.type === 'link' ? (
             <a 
               href={methodData.content}
               className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold text-xs py-2.5 rounded-lg hover:bg-zinc-200 transition-colors shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)]"
             >
               {methodData.icon}
               {methodData.label}
             </a>
          ) : (
            <div className="group/cmd relative">
                 <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1 pl-1">
                    <span className="uppercase font-bold tracking-wider">
                      {methodData.label}
                    </span>
                    {copied && <span className="text-emerald-500">Copied!</span>}
                 </div>
                 <button 
                   onClick={() => copyToClipboard(methodData.content)}
                   className="w-full bg-black/40 border border-zinc-800 rounded px-3 py-2.5 text-xs text-zinc-400 font-mono text-left flex items-center justify-between hover:text-zinc-200 hover:border-zinc-600 transition-all group-hover/cmd:bg-black/60"
                 >
                   <span className="truncate mr-3 text-indigo-400/90 select-all">
                     {methodData.type === 'command' ? '$ ' : ''}{methodData.content}
                   </span>
                   <Copy size={12} className="shrink-0 opacity-50 group-hover/cmd:opacity-100" />
                 </button>
            </div>
          )}

          <div className="flex justify-between items-center pt-1 px-1">
              <span className="text-[10px] text-zinc-600 truncate max-w-[150px] flex items-center gap-1">
                 <BookOpen size={10} /> {model.license}
              </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
