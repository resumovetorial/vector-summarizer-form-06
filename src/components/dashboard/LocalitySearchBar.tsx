
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface LocalitySearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const LocalitySearchBar: React.FC<LocalitySearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full sm:w-64">
      <Input 
        placeholder="Buscar..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default LocalitySearchBar;
