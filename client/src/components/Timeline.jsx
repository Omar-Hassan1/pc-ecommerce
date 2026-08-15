import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

export default function Timeline({ stages = [], currentStageIndex = 0 }) {
  return (
    <div className="w-full py-6">
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        
        {/* Connector Line on Desktop */}
        <div className="hidden md:block absolute top-5 left-6 right-6 h-0.5 bg-gray-800 -z-0" />

        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;

          return (
            <div key={index} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 flex-1">
              
              {/* Stage Circle Icon */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                  isCompleted 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : isCurrent 
                    ? 'bg-blue-600 border-blue-400 text-white blue-glow animate-pulse' 
                    : 'bg-gray-900 border-gray-800 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Stage Text Label */}
              <div className="text-left md:text-center">
                <p className={`text-xs font-semibold max-w-[120px] ${
                  isCurrent ? 'text-blue-400 font-bold' : isCompleted ? 'text-emerald-400' : 'text-gray-500'
                }`}>
                  {stage}
                </p>
                {isCurrent && (
                  <span className="inline-block mt-0.5 text-[9px] uppercase font-extrabold bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">
                    Active Stage
                  </span>
                )}
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
