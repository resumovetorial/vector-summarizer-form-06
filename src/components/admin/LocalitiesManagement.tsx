
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { getLocalities, saveLocalities, addLocality, removeLocality } from '@/services/localitiesService';

const LocalitiesManagement: React.FC = () => {
  const [localities, setLocalities] = useState<string[]>([]);
  const [newLocality, setNewLocality] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Load localities when component mounts
    setLocalities(getLocalities());
  }, []);

  const filteredLocalities = localities.filter(locality => 
    locality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLocality = () => {
    if (!newLocality.trim()) {
      toast.error("Por favor, insira um nome para a localidade");
      return;
    }

    if (localities.includes(newLocality.trim())) {
      toast.error("Esta localidade já existe");
      return;
    }

    const success = addLocality(newLocality.trim());
    
    if (success) {
      // Reload the localities to ensure we have the latest data
      setLocalities(getLocalities());
      setNewLocality('');
      toast.success("Localidade adicionada com sucesso!");
    }
  };

  const handleDeleteLocality = (locality: string) => {
    if (confirm(`Tem certeza que deseja excluir a localidade "${locality}"?`)) {
      const success = removeLocality(locality);
      
      if (success) {
        // Reload the localities to ensure we have the latest data
        setLocalities(getLocalities());
        toast.success("Localidade removida com sucesso!");
      }
    }
  };

  const handleSaveChanges = () => {
    const success = saveLocalities(localities);
    if (success) {
      toast.success("Alterações salvas com sucesso!");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Localidades</CardTitle>
        <Button onClick={handleSaveChanges}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Nova localidade..."
              value={newLocality}
              onChange={(e) => setNewLocality(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddLocality();
                }
              }}
            />
            <Button onClick={handleAddLocality}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Buscar localidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Card className="border">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-2">
                  {filteredLocalities.length > 0 ? (
                    filteredLocalities.map((locality) => (
                      <div
                        key={locality}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted"
                      >
                        <span>{locality}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLocality(locality)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhuma localidade encontrada
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
            
            <div className="text-sm text-muted-foreground">
              Total: {localities.length} localidades
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalitiesManagement;
