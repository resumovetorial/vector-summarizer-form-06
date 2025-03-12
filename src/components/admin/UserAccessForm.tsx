
import React, { useState } from 'react';
import { User } from '@/types/admin';
import { localities } from '@/utils/localities';
import LocalitySearchBar from './LocalitySearchBar';
import LocalitiesList from './LocalitiesList';
import SelectedLocalitiesSummary from './SelectedLocalitiesSummary';
import UserAccessFormActions from './UserAccessFormActions';

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
        onCancel={() => onSave(user.assignedLocalities)}
        onSave={() => onSave(selectedLocalities)}
      />
    </div>
  );
};

export default UserAccessForm;
