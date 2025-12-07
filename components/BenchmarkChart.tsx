import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Benchmark {
  name: string;
  score: number;
  maxScore: number;
}

interface Props {
  data: Benchmark[];
}

const BenchmarkChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-32 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 35, left: 35, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }} 
            width={60}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff', fontSize: '12px', padding: '8px', borderRadius: '8px' }}
            itemStyle={{ color: '#e4e4e7' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={8} background={{ fill: '#27272a', radius: [0,4,4,0] }}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.score > 80 ? '#4ade80' : entry.score > 60 ? '#818cf8' : '#fbbf24'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BenchmarkChart;