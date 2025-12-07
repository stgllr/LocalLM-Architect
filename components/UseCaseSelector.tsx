
import React from 'react';
import { UseCase } from '../types';
import { USE_CASE_GROUPS } from '../constants';
import { Check, ChevronRight } from 'lucide-react';

interface Props {
  selected: UseCase[];
  onChange: (selected: UseCase[]) => void;
}

const UseCaseSelector: React.FC<Props> = ({ selected, onChange }) => {
  const toggleCase = (id: UseCase) => {
    if (selected.includes(id)) {
      onChange(selected.filter(c => c !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-semibold text-white">Select Workflows</h2>
         <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{selected.length} Selected</span>
      </div>
      
      <div className="space-y-6">
        {USE_CASE_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          const activeInGroup = group.items.filter(i => selected.includes(i.id)).length;
          
          return (
            <div key={group.category} className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-400 border-b border-zinc-800/60 pb-1">
                <GroupIcon size={14} className={activeInGroup > 0 ? 'text-indigo-400' : 'text-zinc-600'} />
                <span className={`text-xs font-bold uppercase tracking-wider ${activeInGroup > 0 ? 'text-zinc-200' : 'text-zinc-500'}`}>
                  {group.category}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map((uc) => {
                  const isSelected = selected.includes(uc.id);
                  return (
                    <button
                      key={uc.id}
                      onClick={() => toggleCase(uc.id)}
                      className={`
                        relative flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all duration-200 group
                        ${isSelected 
                          ? 'bg-zinc-900 border-indigo-500/50 shadow-[0_0_15px_-10px_rgba(99,102,241,0.3)]' 
                          : 'bg-zinc-950/30 border-zinc-800/40 hover:border-zinc-700 hover:bg-zinc-800/40'}
                      `}
                    >
                      <span className={`text-xs font-medium transition-colors ${isSelected ? 'text-indigo-200' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                        {uc.label}
                      </span>
                      
                      {isSelected ? (
                        <div className="text-indigo-400 animate-in fade-in zoom-in duration-200">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ) : (
                        <ChevronRight size={14} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UseCaseSelector;
