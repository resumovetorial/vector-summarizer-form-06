
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { WeekSummary } from '@/types/dashboard';

interface WeekSummaryChartProps {
  weekSummaries: WeekSummary[];
  year: string;
}

const WeekSummaryChart: React.FC<WeekSummaryChartProps> = ({ weekSummaries, year }) => {
  // Prepare chart data
  const chartData = weekSummaries.map(week => ({
    name: `SE ${week.week}`,
    Inspecionados: week.totalInspections,
    'Depósitos Eliminados': week.totalDepositsEliminated,
    'Depósitos Tratados': week.totalDepositsTreated
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo por Semana Epidemiológica - {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Inspecionados" fill="#4f46e5" />
              <Bar dataKey="Depósitos Eliminados" fill="#ef4444" />
              <Bar dataKey="Depósitos Tratados" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekSummaryChart;
