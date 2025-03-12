
import React from 'react';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface SelectedLocalitiesSummaryProps {
  selectedLocalities: string[];
  totalLocalities: number;
  handleToggleLocality: (locality: string) => void;
}

const SelectedLocalitiesSummary: React.FC<SelectedLocalitiesSummaryProps> = ({
  selectedLocalities,
  totalLocalities,
  handleToggleLocality
}) => {
  return (
    <div className="w-full md:w-64">
      <h3 className="text-lg font-medium mb-3">Localidades Selecionadas</h3>
      <Card className="border p-4">
        <div className="mb-2">
          <div className="text-sm text-muted-foreground">
            {selectedLocalities.length} de {totalLocalities} selecionadas
          </div>
        </div>
        
        {selectedLocalities.length > 0 ? (
          <ScrollArea className="h-[350px]">
            <div className="space-y-1">
              {selectedLocalities.map(locality => (
                <div key={locality} className="flex items-center justify-between text-sm p-1 rounded hover:bg-muted">
                  <span>{locality}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => handleToggleLocality(locality)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-sm text-center text-muted-foreground mt-8">
            Nenhuma localidade selecionada
          </div>
        )}
      </Card>
    </div>
  );
};

export default SelectedLocalitiesSummary;
