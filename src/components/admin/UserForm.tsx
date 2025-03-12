
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { AccessLevel } from '@/types/admin';
import { localities } from '@/utils/localities';

interface UserFormProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  accessLevel: string;
  setAccessLevel: (value: string) => void;
  active: boolean;
  setActive: (value: boolean) => void;
  selectedLocalities: string[];
  setSelectedLocalities: (value: string[]) => void;
  accessLevels: AccessLevel[];
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const UserForm: React.FC<UserFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  role,
  setRole,
  accessLevel,
  setAccessLevel,
  active,
  setActive,
  selectedLocalities,
  setSelectedLocalities,
  accessLevels,
  onCancel,
  onSubmit,
  submitLabel
}) => {
  
  const handleToggleLocality = (locality: string) => {
    if (selectedLocalities.includes(locality)) {
      setSelectedLocalities(selectedLocalities.filter(l => l !== locality));
    } else {
      setSelectedLocalities([...selectedLocalities, locality]);
    }
  };
  
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Cargo</Label>
        <Input 
          id="role" 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="accessLevel">Nível de Acesso</Label>
        <Select 
          value={accessLevel} 
          onValueChange={setAccessLevel}
        >
          <SelectTrigger id="accessLevel">
            <SelectValue placeholder="Selecione um nível" />
          </SelectTrigger>
          <SelectContent>
            {accessLevels.map(level => (
              <SelectItem key={level.id} value={level.id.toString()}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex space-x-4">
          <Button
            type="button"
            variant={active ? "default" : "outline"}
            onClick={() => setActive(true)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Ativo
          </Button>
          <Button
            type="button"
            variant={!active ? "default" : "outline"}
            onClick={() => setActive(false)}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Inativo
          </Button>
        </div>
      </div>
      
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
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default UserForm;
