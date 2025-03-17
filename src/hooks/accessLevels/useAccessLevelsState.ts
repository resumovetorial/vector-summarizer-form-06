
import { useState } from 'react';
import { AccessLevel } from '@/types/admin';

/**
 * Hook for managing access level state
 */
export const useAccessLevelsState = () => {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<AccessLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPermissions, setFormPermissions] = useState('');

  /**
   * Reset form fields to their initial values
   */
  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPermissions('');
    setSelectedLevel(null);
  };

  /**
   * Set up an access level for editing
   */
  const openEditDialog = (level: AccessLevel) => {
    setSelectedLevel(level);
    setFormName(level.name);
    setFormDescription(level.description);
    setFormPermissions(level.permissions.join(', '));
    setIsEditDialogOpen(true);
  };

  return {
    // State
    accessLevels,
    setAccessLevels,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedLevel,
    setSelectedLevel,
    isLoading,
    setIsLoading,
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    formPermissions,
    setFormPermissions,
    
    // Actions
    resetForm,
    openEditDialog,
  };
};
