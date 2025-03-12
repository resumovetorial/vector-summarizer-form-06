
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface WeekSummaryCardProps {
  title: string;
  value: number;
}

const WeekSummaryCard: React.FC<WeekSummaryCardProps> = ({ title, value }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default WeekSummaryCard;
