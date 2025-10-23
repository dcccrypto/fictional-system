'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AITrader } from '@/types';

interface ModelsComparisonChartProps {
  traders: AITrader[];
}

export default function ModelsComparisonChart({ traders }: ModelsComparisonChartProps) {
  const data = traders.map(trader => ({
    name: trader.name.split(' ')[0], // Just first name for cleaner display
    earnings: trader.current_balance - trader.initial_balance,
    profitLoss: trader.profit_loss_percentage,
    fullName: trader.name
  })).sort((a, b) => b.earnings - a.earnings);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4">
          <p className="font-bold text-foreground mb-2">{data.fullName}</p>
          <p className={`text-lg font-bold ${data.earnings >= 0 ? 'text-profit' : 'text-loss'}`}>
            ${data.earnings.toFixed(2)}
          </p>
          <p className="text-sm text-foreground/70">
            {data.profitLoss >= 0 ? '+' : ''}{data.profitLoss.toFixed(2)}% P/L
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis
          dataKey="name"
          stroke="rgba(0, 0, 0, 0.5)"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          stroke="rgba(0, 0, 0, 0.5)"
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="earnings" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.earnings >= 0 ? '#00ff88' : '#ff0055'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

