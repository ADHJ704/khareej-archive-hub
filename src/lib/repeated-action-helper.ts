
import { useState } from 'react';

export function useRepeatedActionConfirmation(threshold = 2) {
  const [actionCount, setActionCount] = useState(0);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const trackAction = () => {
    const newCount = actionCount + 1;
    setActionCount(newCount);

    if (newCount >= threshold) {
      setNeedsConfirmation(true);
      return false;
    }
    return true;
  };

  const resetAction = () => {
    setActionCount(0);
    setNeedsConfirmation(false);
  };

  return { 
    needsConfirmation, 
    trackAction, 
    resetAction 
  };
}
