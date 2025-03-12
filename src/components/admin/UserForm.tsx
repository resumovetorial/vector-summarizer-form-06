
import React from 'react';
import { AccessLevel } from '@/types/admin';
import UserBasicInfoFields from './UserBasicInfoFields';
import UserLocalitiesSelector from './UserLocalitiesSelector';
import UserFormActions from './UserFormActions';

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
  isLoading?: boolean;
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
  submitLabel,
  isLoading = false
}) => {
  return (
    <div className="space-y-4 pt-4">
      <UserBasicInfoFields
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        role={role}
        setRole={setRole}
        accessLevel={accessLevel}
        setAccessLevel={setAccessLevel}
        active={active}
        setActive={setActive}
        accessLevels={accessLevels}
      />
      
      <UserLocalitiesSelector
        selectedLocalities={selectedLocalities}
        setSelectedLocalities={setSelectedLocalities}
      />
      
      <UserFormActions
        onCancel={onCancel}
        onSubmit={onSubmit}
        submitLabel={submitLabel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserForm;
