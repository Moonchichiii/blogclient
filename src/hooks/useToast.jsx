import { useState, useCallback } from 'react';

const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  return { toast, showToast };
};

export default useToast;