
import { useState, useEffect, useCallback } from 'react';

const useIdleTimer = (timeout: number, onIdle: () => void) => {
  const [isIdle, setIsIdle] = useState(false);
  let timerId: number | undefined;

  const resetTimer = useCallback(() => {
    if (timerId) {
      clearTimeout(timerId);
    }
    setIsIdle(false);
    timerId = window.setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
  }, [timeout, onIdle]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
    
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    resetTimer(); // Initialize timer

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [resetTimer]);

  return isIdle;
};

export default useIdleTimer;
    