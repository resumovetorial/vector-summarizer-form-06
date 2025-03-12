
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface LocalitiesListProps {
  filteredLocalities: string[];
  selectedLocalities: string[];
  handleToggleLocality: (locality: string) => void;
}

const LocalitiesList: React.FC<LocalitiesListProps> = ({
  filteredLocalities,
  selectedLocalities,
  handleToggleLocality
}) => {
  return (
    <Card className="border p-1">
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-2">
          {filteredLocalities.map(locality => (
            <div 
              key={locality} 
              className={`flex items-center space-x-2 p-2 rounded 
                ${selectedLocalities.includes(locality) ? 'bg-accent' : 'hover:bg-muted'}`}
            >
              <Checkbox 
                id={`locality-${locality}`}
                checked={selectedLocalities.includes(locality)} 
                onCheckedChange={() => handleToggleLocality(locality)}
              />
              <label 
                htmlFor={`locality-${locality}`}
                className="text-sm cursor-pointer flex-1"
              >
                {locality}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default LocalitiesList;
