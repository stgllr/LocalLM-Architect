
import React, { useState } from 'react';
import { HardwareSpecs } from '../types';
import { Cpu, Database, HardDrive, Monitor, Zap, Save, MemoryStick } from 'lucide-react';

interface Props {
  hardware: HardwareSpecs;
  onChange: (hw: HardwareSpecs) => void;
}

const HardwareDetector: React.FC<Props> = ({ hardware, onChange }) => {
  const [detecting, setDetecting] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleAutoDetect = async () => {
    setDetecting(true);
    setStatus("Scanning environment...");
    
    // WebGPU Detection
    let gpuInfo = { vendor: 'Unknown', vram: 0 };
    if ('gpu' in navigator) {
       try {
         // @ts-ignore
         const adapter = await navigator.gpu.requestAdapter();
         if (adapter) {
           const info = await adapter.requestAdapterInfo();
           gpuInfo.vendor = info.vendor || gpuInfo.vendor;
           // WebGPU doesn't directly give VRAM size securely, we estimate below
         }
       } catch (e) {
         console.debug("WebGPU access denied or not supported");
       }
    }

    // Canvas fallback for GPU Vendor
    if (gpuInfo.vendor === 'Unknown') {
       const canvas = document.createElement('canvas');
       // Fix: Cast to WebGLRenderingContext to ensure getExtension/getParameter are available
       const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
       if (gl) {
         const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
         if (debugInfo) {
           const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
           if (renderer.includes('NVIDIA')) gpuInfo.vendor = 'NVIDIA';
           else if (renderer.includes('AMD') || renderer.includes('Radeon')) gpuInfo.vendor = 'AMD';
           else if (renderer.includes('Intel')) gpuInfo.vendor = 'Intel';
           else if (renderer.includes('Apple')) gpuInfo.vendor = 'Apple Silicon';
         }
       }
    }

    // Heuristics for Memory
    // @ts-ignore
    const deviceMemory = navigator.deviceMemory || 8; // RAM approximation
    
    // Estimate VRAM based on System RAM and Vendor
    let estimatedVram = 8;
    if (gpuInfo.vendor === 'Apple Silicon') {
        // Unified memory - usually 70% available for GPU
        estimatedVram = Math.floor(deviceMemory * 0.7);
    } else if (gpuInfo.vendor === 'NVIDIA') {
        // Simple heuristic guess if we can't detect
        estimatedVram = 8; 
    } else if (gpuInfo.vendor === 'Intel') {
        estimatedVram = 4; // iGPUs usually share less
    }

    // Platform detection
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const isWin = navigator.platform.toLowerCase().includes('win');
    const os = isMac ? 'macOS' : (isWin ? 'Windows' : 'Linux');
    const cpuType = isMac ? 'Apple Silicon' : 'Intel/AMD';

    setTimeout(() => {
      onChange({
        gpuVendor: gpuInfo.vendor !== 'Unknown' ? gpuInfo.vendor : hardware.gpuVendor,
        vram: estimatedVram,
        ram: deviceMemory,
        cpuType: cpuType,
        os: os,
        diskSpace: hardware.diskSpace // Keep user input or default
      });
      setDetecting(false);
      setStatus("");
    }, 1200);
  };

  const updateField = (field: keyof HardwareSpecs, value: any) => {
    onChange({ ...hardware, [field]: value });
  };

  const isApple = hardware.gpuVendor === 'Apple Silicon';
  const isIntel = hardware.gpuVendor === 'Intel';
  const isShared = isApple || isIntel;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Monitor className="text-indigo-400" /> System Profile
        </h2>
        <button
          onClick={handleAutoDetect}
          disabled={detecting}
          className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all border border-indigo-500/20 flex items-center gap-2"
        >
          {detecting ? (
             <><div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> {status}</>
          ) : (
             <><Zap size={12} /> Auto-Detect Hardware</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 relative z-10">
        {/* GPU Vendor */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Monitor size={14} /> GPU Architecture
          </label>
          <select
            value={hardware.gpuVendor}
            onChange={(e) => updateField('gpuVendor', e.target.value)}
            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          >
            <option value="NVIDIA">NVIDIA (CUDA)</option>
            <option value="AMD">AMD (ROCm)</option>
            <option value="Apple Silicon">Apple Silicon (Metal)</option>
            <option value="Intel">Intel (Arc/iGPU)</option>
            <option value="NPU">Dedicated NPU</option>
          </select>
        </div>

        {/* VRAM / Unified Memory */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 justify-between">
            <span className="flex items-center gap-1.5">
                <Database size={14} /> 
                {isApple ? "Unified Memory" : isIntel ? "Shared Memory (VRAM)" : "Video Memory (VRAM)"}
            </span>
            {isShared && (
                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    Shared
                </span>
            )}
          </label>
          <div className="relative">
            <input
              type="number"
              value={hardware.vram}
              onChange={(e) => updateField('vram', Number(e.target.value))}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <div className="absolute right-3 top-2.5 text-xs text-zinc-600 font-mono">GB</div>
          </div>
        </div>

        {/* RAM */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <HardDrive size={14} /> System RAM
          </label>
          <div className="relative">
            <input
              type="number"
              value={hardware.ram}
              onChange={(e) => updateField('ram', Number(e.target.value))}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <div className="absolute right-3 top-2.5 text-xs text-zinc-600 font-mono">GB</div>
          </div>
        </div>

        {/* Disk Space */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Save size={14} /> Free Disk Space
          </label>
          <div className="relative">
            <input
              type="number"
              value={hardware.diskSpace}
              onChange={(e) => updateField('diskSpace', Number(e.target.value))}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <div className="absolute right-3 top-2.5 text-xs text-zinc-600 font-mono">GB</div>
          </div>
        </div>

        {/* CPU */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Cpu size={14} /> Processor Family
          </label>
          <select
            value={hardware.cpuType}
            onChange={(e) => updateField('cpuType', e.target.value)}
            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          >
            <option value="Intel/AMD">Intel / AMD x86_64</option>
            <option value="Apple Silicon">Apple Silicon (ARM)</option>
            <option value="RISC-V">RISC-V</option>
            <option value="ARM64">Other ARM64</option>
          </select>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-zinc-800/50 flex gap-4">
         <div className="flex-1">
             <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${hardware.vram < 8 ? 'bg-red-500' : hardware.vram < 16 ? 'bg-yellow-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(100, (hardware.vram / 24) * 100)}%` }}
                ></div>
             </div>
             <p className="text-[10px] text-zinc-500 mt-1.5 text-right flex justify-end items-center gap-1">
                 {isShared ? "Effective GPU Memory" : "VRAM Capacity Tier"}
             </p>
         </div>
      </div>
    </div>
  );
};

export default HardwareDetector;
