import { useState, useEffect } from 'react';
import { User } from '@/types/admin';

interface UseUserFormStateProps {
  initialUser?: User | null;
  isEditMode: boolean;
}

export const useUserFormState = ({
  initialUser,
  isEditMode
}: UseUserFormStateProps) => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formAccessLevel, setFormAccessLevel] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formLocalities, setFormLocalities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  useEffect(() => {
    if (initialUser && isEditMode) {
      setFormName(initialUser.name);
      setFormEmail(initialUser.email);
      setFormRole(initialUser.role);
      setFormAccessLevel(initialUser.accessLevelId.toString());
      setFormActive(initialUser.active);
      setFormLocalities([...initialUser.assignedLocalities]);
      
      console.log("Form initialized with:", {
        name: initialUser.name,
        email: initialUser.email,
        role: initialUser.role,
        accessLevelId: initialUser.accessLevelId.toString(),
        active: initialUser.active,
        localities: initialUser.assignedLocalities
      });
    } else {
      resetForm();
    }
  }, [initialUser, isEditMode]);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('');
    setFormAccessLevel('');
    setFormActive(true);
    setFormLocalities([]);
  };

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
    setIsLoading,
    resetForm,
    formErrors,
    setFormErrors
  };
};
