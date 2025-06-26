
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button'; // If a submit button is needed, or for general styling

const PinAuth: React.FC = () => {
  const { pinLogin, isLoading, error } = useAuthStore();
  const [pin, setPin] = useState<string[]>(Array(4).fill(''));
  const [padlockState, setPadlockState] = useState<'locked' | 'verifying' | 'unlocked' | 'error'>('locked');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (error) {
        setErrorMessage(error);
        setPadlockState('error');
        // Clear pin on global store error that might not be from this component's direct submit
        setTimeout(() => {
            setPin(Array(4).fill(''));
            inputRefs.current[0]?.focus();
            setPadlockState('locked');
            setErrorMessage(null); 
            useAuthStore.setState({ error: null }); // Clear global error
        }, 1500);
    }
  }, [error]);

  const handlePinChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow numbers or empty

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setErrorMessage(null); // Clear error message on new input
    setPadlockState('locked');


    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit if all 4 digits are filled
    const filledPin = newPin.filter(digit => digit !== '');
    if (filledPin.length === 4) {
      handleSubmitPin(newPin.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      const newPin = [...pin];
      newPin[index] = ''; // Clear current even if focusing previous
      setPin(newPin);
    }
  };

  const handleSubmitPin = async (currentPinValue: string) => {
    setPadlockState('verifying');
    setErrorMessage(null);

    // Simulate verification delay for animation
    await new Promise(resolve => setTimeout(resolve, 700));

    const success = await pinLogin(currentPinValue);
    if (success) {
      setPadlockState('unlocked');
      // Navigation will occur due to isAuthenticated state change in zustand
    } else {
      setPadlockState('error');
      setErrorMessage(useAuthStore.getState().error || 'PIN Incorreto.'); // Get latest error
      setTimeout(() => {
        setPin(Array(4).fill(''));
        inputRefs.current[0]?.focus();
        setPadlockState('locked');
        // Error message clearing is handled by new input or useEffect for global error
      }, 1500); // Reset after error display
    }
  };
  
  const padlockVariants = {
    locked: { rotate: 0, scale: 1, color: "hsl(var(--foreground))" },
    verifying: { scale: [1, 1.05, 1], transition: { duration: 0.3, repeat: Infinity, repeatType: "mirror" as const } },
    unlocked: { rotate: 0, scale: [1, 1.2, 1], color: "hsl(var(--primary))", transition: { duration: 0.5, type: "spring" as const, stiffness: 200, damping: 10 } },
    error: { x: [0, -4, 4, -4, 4, -2, 2, 0], color: "hsl(var(--destructive))", transition: { duration: 0.4 } },
  };

  const currentPadlockColor = padlockState === 'unlocked' ? 'text-green-500 dark:text-green-400' :
                             padlockState === 'error' ? 'text-red-500 dark:text-red-400' :
                             'text-gray-400 dark:text-gray-500';


  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      <motion.div
        key={padlockState} // Key change can help reset/trigger animations if needed
        animate={padlockState}
        variants={padlockVariants}
        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full shadow-md"
      >
        {padlockState === 'unlocked' 
          ? <Unlock size={48} className={currentPadlockColor} /> 
          : <Lock size={48} className={currentPadlockColor} />
        }
      </motion.div>

      <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">Digite seu PIN de Acesso</h2>
      
      <div className="flex space-x-2">
        {pin.map((digit, index) => (
          <Input
            key={index}
            ref={el => { inputRefs.current[index] = el; }}
            type="password" // Keeps it as dots
            maxLength={1}
            value={digit}
            onChange={(e) => handlePinChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-12 h-14 text-center text-2xl font-semibold mx-1 rounded-lg 
                        border-2 
                        ${padlockState === 'error' ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
                        focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white caret-transparent`}
            aria-label={`PIN dígito ${index + 1}`}
            disabled={isLoading || padlockState === 'verifying' || padlockState === 'unlocked'}
            autoFocus={index === 0}
          />
        ))}
      </div>

      <AnimatePresence>
        {isLoading && padlockState === 'verifying' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-blue-500 dark:text-blue-400"
          >
            Verificando...
          </motion.p>
        )}
        {errorMessage && padlockState === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center text-sm text-red-500 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/30 rounded-md"
          >
            <AlertCircle size={18} className="mr-2"/>
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
      {/* No explicit submit button, submission is automatic on 4th digit */}
    </div>
  );
};

export default PinAuth; // Changed from Auth to PinAuth if treated as new file, otherwise keep export default Auth;
// For this task, assuming file Auth.tsx is being REPLACED, so `export default Auth` is fine.
