
// Main access levels hooks export
import { useAccessLevelsState } from './useAccessLevelsState';
import { useAccessLevelOperations } from './useAccessLevelOperations';
import { useAccessLevelsPermissions } from './useAccessLevelsPermissions';

/**
 * Hook for managing access levels
 */
export const useAccessLevels = () => {
  // Access level state management
  const { 
    accessLevels, 
    setAccessLevels, 
    isLoading, 
    setIsLoading,
    selectedLevel,
    setSelectedLevel,
    isAddDialogOpen,
    setIsAddDialogOpen, 
    isEditDialogOpen,
    setIsEditDialogOpen,
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    formPermissions,
    setFormPermissions,
    resetForm
  } = useAccessLevelsState();

  // Access level operations (CRUD)
  const {
    loadAccessLevels,
    handleAddLevel,
    handleEditLevel,
    handleDeleteLevel
  } = useAccessLevelOperations(
    accessLevels,
    setAccessLevels,
    setIsLoading,
    resetForm,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    selectedLevel
  );

  // User permissions for access levels
  const { isAdmin } = useAccessLevelsPermissions();

  return {
    // State
    accessLevels,
    isLoading,
    selectedLevel,
    setSelectedLevel,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    formPermissions,
    setFormPermissions,
    resetForm,
    // Operations
    loadAccessLevels,
    handleAddLevel,
    handleEditLevel,
    handleDeleteLevel,
    // Permissions
    isAdmin
  };
};

export { useAccessLevelsPermissions } from './useAccessLevelsPermissions';
