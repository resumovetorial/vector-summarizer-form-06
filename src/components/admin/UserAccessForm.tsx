
import React, { useState, useEffect } from 'react';
import { User } from '@/types/admin';
import { localities } from '@/utils/localities';
import LocalitySearchBar from './LocalitySearchBar';
import LocalitiesList from './LocalitiesList';
import SelectedLocalitiesSummary from './SelectedLocalitiesSummary';
import UserAccessFormActions from './UserAccessFormActions';
import { Skeleton } from '@/components/ui/skeleton';

interface UserAccessFormProps {
  user: User;
  onSave: (localities: string[]) => void;
  isSubmitting?: boolean;
  isLoading?: boolean;
}

const UserAccessForm: React.FC<UserAccessFormProps> = ({ 
  user, 
  onSave,
  isSubmitting = false,
  isLoading = false
}) => {
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>(user.assignedLocalities || []);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Atualizar as localidades selecionadas quando as localidades do usuário forem carregadas
  useEffect(() => {
    if (user.assignedLocalities) {
      setSelectedLocalities(user.assignedLocalities);
    }
  }, [user.assignedLocalities]);
  
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

  const handleCancel = () => {
    // Reset to original localities and close
    onSave(user.assignedLocalities || []);
  };

  const handleSave = () => {
    console.log("Salvando localidades:", selectedLocalities);
    onSave(selectedLocalities);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="md:w-1/3">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <LocalitySearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectAll={selectAll}
            selectNone={selectNone}
          />
          
          <LocalitiesList
            filteredLocalities={filteredLocalities}
            selectedLocalities={selectedLocalities}
            handleToggleLocality={handleToggleLocality}
          />
        </div>
        
        <SelectedLocalitiesSummary
          selectedLocalities={selectedLocalities}
          totalLocalities={localities.length}
          handleToggleLocality={handleToggleLocality}
        />
      </div>
      
      <UserAccessFormActions
        onCancel={handleCancel}
        onSave={handleSave}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default UserAccessForm;
