'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data: { value: number }[];
  color?: string;
  className?: string;
}

export default function MiniChart({ 
  data, 
  color = '#00ff88',
  className = '' 
}: MiniChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={`h-12 w-24 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


