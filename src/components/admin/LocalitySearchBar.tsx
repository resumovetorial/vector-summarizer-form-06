
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocalitySearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectAll: () => void;
  selectNone: () => void;
}

const LocalitySearchBar: React.FC<LocalitySearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectAll,
  selectNone
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar localidades..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <Button variant="outline" size="sm" onClick={selectAll}>
        Selecionar Todos
      </Button>
      <Button variant="outline" size="sm" onClick={selectNone}>
        Limpar Seleção
      </Button>
    </div>
  );
};

export default LocalitySearchBar;
