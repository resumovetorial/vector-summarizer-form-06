
import React, { useState } from 'react';
import { Check, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/types/admin';
import { localities } from '@/utils/localities';

interface UserAccessFormProps {
  user: User;
  onSave: (localities: string[]) => void;
}

const UserAccessForm: React.FC<UserAccessFormProps> = ({ user, onSave }) => {
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>(user.assignedLocalities || []);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredLocalities = localities.filter(locality => 
    locality.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleToggleLocality = (locality: string) => {
    if (selectedLocalities.includes(locality)) {
      setSelectedLocalities(selectedLocalities.filter(l => l !== locality));
    } else {
      setSelectedLocalities([...selectedLocalities, locality]);
    }
  };
  
  const selectAll = () => {
    setSelectedLocalities([...localities]);
  };
  
  const selectNone = () => {
    setSelectedLocalities([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Buscar localidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={selectAll}>
              Selecionar Todos
            </Button>
            <Button variant="outline" size="sm" onClick={selectNone}>
              Limpar Seleção
            </Button>
          </div>
          
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
        </div>
        
        <div className="w-full md:w-64">
          <h3 className="text-lg font-medium mb-3">Localidades Selecionadas</h3>
          <Card className="border p-4">
            <div className="mb-2">
              <div className="text-sm text-muted-foreground">
                {selectedLocalities.length} de {localities.length} selecionadas
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
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => onSave(user.assignedLocalities)}>
          Cancelar
        </Button>
        <Button onClick={() => onSave(selectedLocalities)}>
          Salvar Configurações de Acesso
        </Button>
      </div>
    </div>
  );
};

export default UserAccessForm;
