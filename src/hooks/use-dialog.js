import { useCallback, useState } from 'react';

export function useDialog() {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  return {
    handleClose,
    handleOpen,
    handleToggle,
    open
  };
}
