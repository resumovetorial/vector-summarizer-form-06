
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { localities } from '@/utils/localities';

interface UserLocalitiesSelectorProps {
  selectedLocalities: string[];
  setSelectedLocalities: (value: string[]) => void;
}

const UserLocalitiesSelector: React.FC<UserLocalitiesSelectorProps> = ({
  selectedLocalities,
  setSelectedLocalities,
}) => {
  const handleToggleLocality = (locality: string) => {
    if (selectedLocalities.includes(locality)) {
      setSelectedLocalities(selectedLocalities.filter(l => l !== locality));
    } else {
      setSelectedLocalities([...selectedLocalities, locality]);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>Localidades Permitidas</Label>
      <Card className="border p-2">
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-2">
            {localities.map(locality => (
              <div 
                key={locality} 
                className={`flex items-center space-x-2 p-2 rounded 
                  ${selectedLocalities.includes(locality) ? 'bg-accent' : 'hover:bg-muted'}`}
              >
                <Checkbox 
                  id={`locality-form-${locality}`}
                  checked={selectedLocalities.includes(locality)} 
                  onCheckedChange={() => handleToggleLocality(locality)}
                />
                <label 
                  htmlFor={`locality-form-${locality}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {locality}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
      <div className="text-sm text-muted-foreground">
        {selectedLocalities.length} de {localities.length} localidades selecionadas
      </div>
    </div>
  );
};

export default UserLocalitiesSelector;
