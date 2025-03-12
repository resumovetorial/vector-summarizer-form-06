
import { User, AccessLevel } from '@/types/admin';
import { useUserFormState } from './useUserFormState';
import { useUserFormSubmit } from './useUserFormSubmit';

interface UseUserFormProps {
  initialUser?: User | null;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  accessLevels: AccessLevel[];
  onSuccess: () => void;
  isEditMode: boolean;
}

export const useUserForm = ({
  initialUser,
  users,
  setUsers,
  accessLevels,
  onSuccess,
  isEditMode
}: UseUserFormProps) => {
  const {
    formName,
    setFormName,
    formEmail,
    setFormEmail,
    formRole,
    setFormRole,
    formAccessLevel,
    setFormAccessLevel,
    formActive,
    setFormActive,
    formLocalities,
    setFormLocalities,
    isLoading,
    setIsLoading,
    resetForm,
    formErrors,
    setFormErrors
  } = useUserFormState({
    initialUser,
    isEditMode
  });

  const { handleSubmit: submitForm } = useUserFormSubmit({
    users,
    setUsers,
    accessLevels,
    onSuccess,
    isEditMode,
    formData: {
      name: formName,
      email: formEmail,
      role: formRole,
      accessLevel: formAccessLevel,
      active: formActive,
      localities: formLocalities
    },
    initialUser,
    setIsLoading,
    setFormErrors
  });

  return {
    formName,
    setFormName,
    formEmail,
    setFormEmail,
    formRole,
    setFormRole,
    formAccessLevel,
    setFormAccessLevel,
    formActive,
    setFormActive,
    formLocalities,
    setFormLocalities,
    isLoading,
    resetForm,
    handleSubmit: submitForm,
    formErrors
  };
};
