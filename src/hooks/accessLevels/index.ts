
import { useEffect } from 'react';
import { useAccessLevelsState } from './useAccessLevelsState';
import { useAccessLevelOperations } from './useAccessLevelOperations';
import { useAccessLevelsPermissions } from './useAccessLevelsPermissions';

/**
 * Main hook for accessing and managing access levels
 */
export const useAccessLevels = () => {
  const state = useAccessLevelsState();
  
  const operations = useAccessLevelOperations(
    state.accessLevels,
    state.setAccessLevels,
    state.setIsLoading,
    state.resetForm,
    state.setIsAddDialogOpen,
    state.setIsEditDialogOpen,
    state.selectedLevel
  );
  
  const permissions = useAccessLevelsPermissions();

  // Load access levels when the component mounts
  useEffect(() => {
    operations.loadAccessLevels();
  }, [operations.loadAccessLevels]);
  
  // Wrapper functions that use the state values
  const handleAddLevel = async () => {
    await operations.handleAddLevel(
      state.formName,
      state.formDescription,
      state.formPermissions
    );
  };
  
  const handleEditLevel = async () => {
    await operations.handleEditLevel(
      state.formName,
      state.formDescription,
      state.formPermissions
    );
  };

  return {
    // State
    accessLevels: state.accessLevels,
    isLoading: state.isLoading,
    isAddDialogOpen: state.isAddDialogOpen,
    isEditDialogOpen: state.isEditDialogOpen,
    formName: state.formName,
    formDescription: state.formDescription,
    formPermissions: state.formPermissions,
    selectedLevel: state.selectedLevel,
    
    // State setters
    setIsAddDialogOpen: state.setIsAddDialogOpen,
    setIsEditDialogOpen: state.setIsEditDialogOpen,
    setFormName: state.setFormName,
    setFormDescription: state.setFormDescription,
    setFormPermissions: state.setFormPermissions,
    
    // Operations
    handleAddLevel,
    handleEditLevel,
    handleDeleteLevel: operations.handleDeleteLevel,
    openEditDialog: state.openEditDialog,
    
    // Permissions
    isAdmin: permissions.isAdmin
  };
};
