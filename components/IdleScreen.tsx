
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react'; // Placeholder logo icon

interface IdleScreenProps {
  isVisible: boolean;
}

const IdleScreen: React.FC<IdleScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-900 bg-opacity-95 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        <Briefcase className="w-24 h-24 text-blue-400 mb-6" />
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className="text-4xl font-bold text-white"
      >
        Advocacia MZ
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="text-lg text-gray-300 mt-2"
      >
        Sistema em descanso para sua privacidade. Mexa o mouse para retornar.
      </motion.p>
    </motion.div>
  );
};

export default IdleScreen;
    